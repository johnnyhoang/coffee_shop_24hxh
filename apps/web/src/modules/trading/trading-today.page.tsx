import { useEffect, useState, type CSSProperties } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Heading } from 'react-aria-components';
import toast from 'react-hot-toast';

import { Button } from 'components/button';
import { Dialog } from 'components/dialog';
import { Loading } from 'components/loading';
import { Modal } from 'components/modal';
import { PageListCard } from 'components/page-list';
import { axios } from 'lib/axios';
import type { TLocationDTO } from 'modules/locations/location.type';
import { transformLocations } from 'modules/locations/location.type';

const STORAGE_LOCATION = 'tradingTodayLocationId';
/** Lưu số hàng / cột sơ đồ quán (restaurant floor grid) */
const STORAGE_FLOOR_GRID = 'tradingFloorGrid';

const FLOOR_ROWS_MIN = 1;
const FLOOR_ROWS_MAX = 16;
const FLOOR_COLS_MIN = 1;
const FLOOR_COLS_MAX = 16;

function clampInt(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, Math.floor(n)));
}

function readFloorGrid(): { rows: number; cols: number } {
  try {
    const raw = localStorage.getItem(STORAGE_FLOOR_GRID);
    if (!raw) return { rows: 4, cols: 5 };
    const j = JSON.parse(raw) as { rows?: number; cols?: number };
    return {
      rows: clampInt(Number(j.rows), FLOOR_ROWS_MIN, FLOOR_ROWS_MAX),
      cols: clampInt(Number(j.cols), FLOOR_COLS_MIN, FLOOR_COLS_MAX),
    };
  } catch {
    return { rows: 4, cols: 5 };
  }
}

type SnapshotTable = {
  table: {
    tableId: number;
    tableNumber: number;
    tableSize: string | null;
    locationId: number | null;
  };
  activeSession: {
    sessionId: number;
    guestCount: number;
    openedAt: string;
  } | null;
};

type TodaySnapshot = {
  locationId: number;
  stats: {
    occupiedTables: number;
    totalGuestsToday: number;
    visitsToday: number;
  };
  tables: SnapshotTable[];
};

async function fetchSnapshot(locationId: number): Promise<TodaySnapshot> {
  const res = await axios.get<TodaySnapshot>('table-sessions/today', {
    params: { locationId },
  });
  return res.data;
}

export default function TradingTodayPage() {
  const queryClient = useQueryClient();
  const { data: locationsRaw, isLoading: loadingLocations } = useQuery({
    queryKey: ['locations', 'trading'],
    queryFn: async () => {
      const res = await axios.get<TLocationDTO[]>('locations');
      return transformLocations(res.data ?? []);
    },
  });

  const [locationId, setLocationId] = useState<number | ''>('');

  useEffect(() => {
    if (!locationsRaw?.length) return;
    const saved = localStorage.getItem(STORAGE_LOCATION);
    const parsed = saved ? Number(saved) : NaN;
    const valid =
      Number.isFinite(parsed) &&
      locationsRaw.some((l) => l.locationId === parsed);
    if (valid) {
      setLocationId(parsed);
      return;
    }
    const first = locationsRaw[0]?.locationId;
    if (first != null) setLocationId(first);
  }, [locationsRaw]);

  const handleLocationChange = (v: number | '') => {
    setLocationId(v);
    if (typeof v === 'number') {
      localStorage.setItem(STORAGE_LOCATION, String(v));
    }
  };

  const {
    data: snapshot,
    isLoading: loadingSnapshot,
    isError,
    error,
  } = useQuery({
    queryKey: ['table-sessions', 'today', locationId],
    queryFn: () => fetchSnapshot(locationId as number),
    enabled: typeof locationId === 'number' && locationId > 0,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ['table-sessions', 'today', locationId],
    });
  };

  const openSessionMutation = useMutation({
    mutationFn: async (payload: {
      tableId: number;
      locationId: number;
      guestCount: number;
    }) => {
      await axios.post('table-sessions', payload);
    },
    onSuccess: () => {
      toast.success('Đã nhận đơn — bàn đang có khách');
      invalidate();
    },
    onError: (e: { response?: { data?: { message?: string } } }) => {
      toast.error(
        e?.response?.data?.message ?? 'Không tạo được phiên phục vụ',
      );
    },
  });

  const updateGuestMutation = useMutation({
    mutationFn: async (payload: { sessionId: number; guestCount: number }) => {
      await axios.patch(`table-sessions/${payload.sessionId}`, {
        guestCount: payload.guestCount,
      });
    },
    onSuccess: () => {
      toast.success('Đã cập nhật số khách');
      invalidate();
    },
    onError: () => toast.error('Không cập nhật được'),
  });

  const closeSessionMutation = useMutation({
    mutationFn: async (sessionId: number) => {
      await axios.post(`table-sessions/${sessionId}/close`);
    },
    onSuccess: () => {
      toast.success('Đã trả bàn');
      invalidate();
    },
    onError: () => toast.error('Không đóng phiên được'),
  });

  const [receiveModal, setReceiveModal] = useState<{
    tableId: number;
    tableNumber: number;
  } | null>(null);
  const [guestInput, setGuestInput] = useState('2');

  const [editModal, setEditModal] = useState<{
    sessionId: number;
    tableNumber: number;
    guestCount: number;
  } | null>(null);
  const [editGuestInput, setEditGuestInput] = useState('');

  const [floorRows, setFloorRows] = useState(4);
  const [floorCols, setFloorCols] = useState(5);

  useEffect(() => {
    const g = readFloorGrid();
    setFloorRows(g.rows);
    setFloorCols(g.cols);
  }, []);

  const persistFloorGrid = (rows: number, cols: number) => {
    const r = clampInt(rows, FLOOR_ROWS_MIN, FLOOR_ROWS_MAX);
    const c = clampInt(cols, FLOOR_COLS_MIN, FLOOR_COLS_MAX);
    localStorage.setItem(STORAGE_FLOOR_GRID, JSON.stringify({ rows: r, cols: c }));
    setFloorRows(r);
    setFloorCols(c);
  };

  if (loadingLocations) {
    return <Loading />;
  }

  if (!locationsRaw?.length) {
    return (
      <div className="rounded-xl border border-cream-200 bg-paper px-4 py-6 text-center text-espresso-700">
        Chưa có chi nhánh. Thêm chi nhánh trước khi xem tình hình bàn.
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-cream-200 bg-paper px-4 py-6 text-center text-espresso-700">
        Không tải được dữ liệu:{' '}
        {error instanceof Error ? error.message : 'Lỗi API'}
      </div>
    );
  }

  return (
    <>
      <PageListCard
        toolbar={
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <label className="flex min-w-[220px] flex-col gap-1 text-sm font-medium text-espresso-800">
                Chi nhánh
                <select
                  className="min-h-[44px] rounded-lg border border-cream-300 bg-paper px-3 py-2 text-espresso-900"
                  value={locationId === '' ? '' : String(locationId)}
                  onChange={(e) => {
                    const v = e.target.value;
                    handleLocationChange(v === '' ? '' : Number(v));
                  }}
                >
                  {locationsRaw.map((l) => (
                    <option
                      key={l.locationId ?? 'x'}
                      value={l.locationId != null ? String(l.locationId) : ''}
                    >
                      {[l.location, l.locationCode].filter(Boolean).join(' — ') ||
                        `#${l.locationId}`}
                    </option>
                  ))}
                </select>
              </label>
              {snapshot && (
                <div className="flex flex-wrap gap-3 text-sm text-espresso-700">
                  <span className="rounded-lg bg-cream-100/90 px-3 py-2">
                    Đang có khách:{' '}
                    <strong className="text-espresso-900">
                      {snapshot.stats.occupiedTables}
                    </strong>{' '}
                    bàn
                  </span>
                  <span className="rounded-lg bg-cream-100/90 px-3 py-2">
                    Khách (trong ngày):{' '}
                    <strong className="text-espresso-900">
                      {snapshot.stats.totalGuestsToday}
                    </strong>
                  </span>
                  <span className="rounded-lg bg-cream-100/90 px-3 py-2">
                    Lượt nhận đơn:{' '}
                    <strong className="text-espresso-900">
                      {snapshot.stats.visitsToday}
                    </strong>
                  </span>
                </div>
              )}
            </div>

            {typeof locationId === 'number' && (
              <div className="flex flex-col gap-2 border-t border-cream-200/80 pt-3 sm:flex-row sm:flex-wrap sm:items-end sm:gap-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-espresso-400">
                  Sơ đồ quán (N hàng × M cột)
                </p>
                <div className="flex flex-wrap items-end gap-4">
                  <label className="flex flex-col gap-1 text-sm font-medium text-espresso-800">
                    Hàng (N)
                    <input
                      type="number"
                      min={FLOOR_ROWS_MIN}
                      max={FLOOR_ROWS_MAX}
                      className="w-[5.5rem] min-h-[44px] rounded-lg border border-cream-300 bg-paper px-3 py-2 text-espresso-900"
                      value={floorRows}
                      onChange={(e) =>
                        persistFloorGrid(Number(e.target.value), floorCols)
                      }
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm font-medium text-espresso-800">
                    Cột (M)
                    <input
                      type="number"
                      min={FLOOR_COLS_MIN}
                      max={FLOOR_COLS_MAX}
                      className="w-[5.5rem] min-h-[44px] rounded-lg border border-cream-300 bg-paper px-3 py-2 text-espresso-900"
                      value={floorCols}
                      onChange={(e) =>
                        persistFloorGrid(floorRows, Number(e.target.value))
                      }
                    />
                  </label>
                  <p className="max-w-md text-xs leading-relaxed text-espresso-500">
                    Ô lưới:{' '}
                    <strong className="text-espresso-700">
                      {floorRows} × {floorCols} = {floorRows * floorCols}
                    </strong>
                    {snapshot
                      ? ` · Bàn trong danh sách: ${snapshot.tables.length}`
                      : null}
                  </p>
                </div>
              </div>
            )}
          </div>
        }
      >
        {typeof locationId !== 'number' || loadingSnapshot ? (
          <Loading />
        ) : !snapshot?.tables.length ? (
          <div className="px-4 py-10 text-center text-sm text-espresso-600">
            Chưa có bàn gắn với chi nhánh này (
            <code className="text-xs">location_id</code> trên bàn). Thêm bàn
            qua API <code className="text-xs">POST /coffeetable</code> với{' '}
            <code className="text-xs">locationId</code> tương ứng.
          </div>
        ) : (
          <RestaurantFloor
            floorRows={floorRows}
            floorCols={floorCols}
            tables={snapshot.tables}
            busy={openSessionMutation.isPending}
            closing={closeSessionMutation.isPending}
            onReceive={(row) => {
              setGuestInput('2');
              setReceiveModal({
                tableId: row.table.tableId,
                tableNumber: row.table.tableNumber,
              });
            }}
            onEditGuests={(row) => {
              if (!row.activeSession) return;
              setEditGuestInput(String(row.activeSession.guestCount));
              setEditModal({
                sessionId: row.activeSession.sessionId,
                tableNumber: row.table.tableNumber,
                guestCount: row.activeSession.guestCount,
              });
            }}
            onCloseSession={(row) => {
              if (!row.activeSession) return;
              closeSessionMutation.mutate(row.activeSession.sessionId);
            }}
          />
        )}
      </PageListCard>

      <Modal
        className="w-[min(100%,420px)] border border-cream-200 bg-paper !p-0 shadow-card"
        isOpen={receiveModal != null}
        onOpenChange={(open) => {
          if (!open) setReceiveModal(null);
        }}
      >
        <Dialog>
          {({ close }) => (
            <div className="p-5">
              <Heading className="font-display text-lg font-semibold text-espresso-900">
                Nhận đơn — Bàn {receiveModal?.tableNumber}
              </Heading>
              <p className="mt-1 text-sm text-espresso-600">
                Ghi nhận có khách và số lượng khách (mở phiên phục vụ).
              </p>
              <label className="mt-4 block text-sm font-medium text-espresso-800">
                Số khách
                <input
                  type="number"
                  min={1}
                  className="mt-1 w-full min-h-[44px] rounded-lg border border-cream-300 bg-paper px-3 py-2 text-espresso-900"
                  value={guestInput}
                  onChange={(e) => setGuestInput(e.target.value)}
                />
              </label>
              <div className="mt-6 flex justify-end gap-2">
                <Button
                  className="bg-cream-200 text-espresso-800 hover:bg-cream-300"
                  onPress={() => close()}
                >
                  Huỷ
                </Button>
                <Button
                  className="bg-rust text-paper hover:bg-[#5c3b2e]"
                  isDisabled={openSessionMutation.isPending || !receiveModal}
                  onPress={() => {
                    const n = Number(guestInput);
                    if (!receiveModal || !Number.isFinite(n) || n < 1) {
                      toast.error('Nhập số khách từ 1 trở lên');
                      return;
                    }
                    openSessionMutation.mutate(
                      {
                        tableId: receiveModal.tableId,
                        locationId: locationId as number,
                        guestCount: n,
                      },
                      {
                        onSuccess: () => {
                          close();
                          setReceiveModal(null);
                        },
                      },
                    );
                  }}
                >
                  {openSessionMutation.isPending ? 'Đang lưu...' : 'Xác nhận'}
                </Button>
              </div>
            </div>
          )}
        </Dialog>
      </Modal>

      <Modal
        className="w-[min(100%,420px)] border border-cream-200 bg-paper !p-0 shadow-card"
        isOpen={editModal != null}
        onOpenChange={(open) => {
          if (!open) setEditModal(null);
        }}
      >
        <Dialog>
          {({ close }) => (
            <div className="p-5">
              <Heading className="font-display text-lg font-semibold text-espresso-900">
                Sửa số khách — Bàn {editModal?.tableNumber}
              </Heading>
              <label className="mt-4 block text-sm font-medium text-espresso-800">
                Số khách
                <input
                  type="number"
                  min={1}
                  className="mt-1 w-full min-h-[44px] rounded-lg border border-cream-300 bg-paper px-3 py-2 text-espresso-900"
                  value={editGuestInput}
                  onChange={(e) => setEditGuestInput(e.target.value)}
                />
              </label>
              <div className="mt-6 flex justify-end gap-2">
                <Button
                  className="bg-cream-200 text-espresso-800 hover:bg-cream-300"
                  onPress={() => close()}
                >
                  Huỷ
                </Button>
                <Button
                  className="bg-espresso-800 text-paper hover:bg-espresso-700"
                  isDisabled={updateGuestMutation.isPending || !editModal}
                  onPress={() => {
                    const n = Number(editGuestInput);
                    if (!editModal || !Number.isFinite(n) || n < 1) {
                      toast.error('Nhập số khách từ 1 trở lên');
                      return;
                    }
                    updateGuestMutation.mutate(
                      { sessionId: editModal.sessionId, guestCount: n },
                      {
                        onSuccess: () => {
                          close();
                          setEditModal(null);
                        },
                      },
                    );
                  }}
                >
                  {updateGuestMutation.isPending ? 'Đang lưu...' : 'Lưu'}
                </Button>
              </div>
            </div>
          )}
        </Dialog>
      </Modal>
    </>
  );
}

function TableCard({
  row,
  busy,
  closing,
  floor,
  onReceive,
  onEditGuests,
  onCloseSession,
}: {
  row: SnapshotTable;
  busy: boolean;
  closing: boolean;
  /** Gọn hơn khi nằm trong lưới N×M (sơ đồ quán) */
  floor?: boolean;
  onReceive: () => void;
  onEditGuests: () => void;
  onCloseSession: () => void;
}) {
  const occupied = row.activeSession != null;
  return (
    <div
      className={`flex min-h-0 flex-col rounded-xl border-2 text-left shadow-sm transition-colors ${
        floor ? 'p-2 sm:p-2.5' : 'p-3 sm:p-4'
      } ${
        occupied
          ? 'border-rust/80 bg-gradient-to-br from-rust/12 to-paper'
          : 'border-cream-200 bg-paper hover:border-cream-300'
      }`}
    >
      <div className="flex items-start justify-between gap-1.5">
        <div className="min-w-0">
          <p
            className={`font-display font-semibold text-espresso-900 ${
              floor ? 'text-base leading-tight' : 'text-lg'
            }`}
          >
            Bàn {row.table.tableNumber}
          </p>
          {row.table.tableSize ? (
            <p
              className={`truncate text-espresso-500 ${floor ? 'text-[10px]' : 'text-xs'}`}
            >
              {row.table.tableSize}
            </p>
          ) : null}
        </div>
        <span
          className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium sm:text-xs ${
            occupied
              ? 'bg-rust/20 text-espresso-900'
              : 'bg-cream-100 text-espresso-600'
          }`}
        >
          {occupied ? 'Có khách' : 'Trống'}
        </span>
      </div>

      {occupied && row.activeSession ? (
        <>
          <p
            className={`text-espresso-800 ${floor ? 'mt-1.5 text-xs' : 'mt-3 text-sm'}`}
          >
            <span className="text-espresso-500">Khách:</span>{' '}
            <strong>{row.activeSession.guestCount}</strong>
          </p>
          <div
            className={`mt-auto flex flex-col gap-1.5 ${floor ? 'pt-2' : 'gap-2 pt-4'}`}
          >
            <Button
              className={`w-full bg-espresso-800 text-paper hover:bg-espresso-700 ${
                floor ? 'min-h-[36px] text-xs' : ''
              }`}
              onPress={onEditGuests}
            >
              Sửa số khách
            </Button>
            <Button
              className={`w-full border border-cream-300 bg-paper text-espresso-800 hover:bg-cream-50 ${
                floor ? 'min-h-[36px] text-xs' : ''
              }`}
              isDisabled={closing}
              onPress={onCloseSession}
            >
              {closing ? 'Đang xử lý...' : 'Trả bàn'}
            </Button>
          </div>
        </>
      ) : (
        <div className={`mt-auto ${floor ? 'pt-2' : 'pt-6'}`}>
          <Button
            className={`w-full bg-rust text-paper hover:bg-[#5c3b2e] ${
              floor ? 'min-h-[40px] text-xs sm:text-sm' : ''
            }`}
            isDisabled={busy}
            onPress={onReceive}
          >
            {busy ? '...' : 'Nhận đơn'}
          </Button>
        </div>
      )}
    </div>
  );
}

function EmptyFloorCell() {
  return (
    <div
      className="flex min-h-[118px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-cream-300/90 bg-cream-50/35 text-center text-[11px] text-espresso-400"
      aria-hidden
    >
      <span className="text-lg leading-none text-cream-300">+</span>
      <span className="mt-1 px-1">Chưa gán bàn</span>
    </div>
  );
}

function RestaurantFloor({
  floorRows,
  floorCols,
  tables,
  busy,
  closing,
  onReceive,
  onEditGuests,
  onCloseSession,
}: {
  floorRows: number;
  floorCols: number;
  tables: SnapshotTable[];
  busy: boolean;
  closing: boolean;
  onReceive: (row: SnapshotTable) => void;
  onEditGuests: (row: SnapshotTable) => void;
  onCloseSession: (row: SnapshotTable) => void;
}) {
  const slotCount = floorRows * floorCols;
  const overflow = tables.length > slotCount;
  const cells: Array<SnapshotTable | null> = [];
  for (let i = 0; i < slotCount; i++) {
    cells.push(tables[i] ?? null);
  }

  return (
    <div className="px-2 pb-4 pt-1 sm:px-4">
      {overflow && (
        <p className="mb-3 rounded-lg border border-amber-200/90 bg-amber-50/90 px-3 py-2 text-center text-xs text-amber-950">
          Có <strong>{tables.length}</strong> bàn — lưới chỉ có{' '}
          <strong>{slotCount}</strong> ô (N×M). Tăng hàng hoặc cột để xem hết
          danh sách.
        </p>
      )}
      <div
        className="rounded-xl border border-cream-200/90 bg-gradient-to-b from-cream-50/50 to-paper p-2 sm:p-3"
        role="region"
        aria-label="Sơ đồ bàn theo hàng và cột"
      >
        <div className="overflow-x-auto">
          <div
            className="mx-auto grid min-w-[272px] gap-2.5 sm:min-w-0 sm:gap-3"
            style={
              {
                gridTemplateColumns: `repeat(${floorCols}, minmax(5.75rem, 1fr))`,
                gridTemplateRows: `repeat(${floorRows}, minmax(118px, auto))`,
              } as CSSProperties
            }
          >
            {cells.map((slot, index) =>
              slot ? (
                <TableCard
                  key={slot.table.tableId}
                  floor
                  row={slot}
                  busy={busy}
                  closing={closing}
                  onReceive={() => onReceive(slot)}
                  onEditGuests={() => onEditGuests(slot)}
                  onCloseSession={() => onCloseSession(slot)}
                />
              ) : (
                <EmptyFloorCell key={`floor-empty-${index}`} />
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
