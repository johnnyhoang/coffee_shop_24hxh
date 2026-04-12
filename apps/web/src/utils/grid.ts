export const getGridHeight = (
  totalItems: number,
  rowHeight: number,
  headerHeight: number,
) => {
  const winHeight = window.innerHeight;
  // min-height should contain at least 2 rows: a header row and an empty row
  const minHeight = headerHeight + rowHeight;
  const totalHeight = totalItems
    ? totalItems * rowHeight + headerHeight
    : minHeight;
  return totalHeight > winHeight ? winHeight : totalHeight;
};

export const getGridBaseConfig = () => {
  return {
    scrollToColumn: 0,
    scrollToRow: 0,
    fixedRowCount: 1,
    enableFixedColumnScroll: true,
    enableFixedRowScroll: true,
    overscanRowCount: 10,
    overscanColumnCount: 10,
    hideTopRightGridScrollbar: true,
    hideBottomLeftGridScrollbar: true,
    classNameTopLeftGrid: 'border bg-[#f8f9fa] font-bold p-0',
    classNameTopRightGrid: 'border border-[#dcdcdd]',
    classNameBottomLeftGrid: 'border border-r border-l border-r-[#ada49a]',
  };
};
