


// Định nghĩa pop để truyền vào component function People-modal
//
// export type PeopleModalProps = BaseModalProps & {
//   people: TPeople;
// };

// Prop modal này, và nhiều modal khác mở rộng từ 1 prop cơ bản dùng chung
// export type BaseModalProps = {
//   title: string; // title của modal bật lên
//   isOpen: boolean; // tỉnh trạng bật iOpen = true, tắt faulse
//   actionType?: ActionType;
//   onOpenChange: (isOpen: boolean) => void;
// };

// ActionType là một tập kiểu enum (kiểu do người dùng định nghĩa)
// export enum ActionType {
//   Add = 'Add',
//   Edit = 'Edit',
//   Delete = 'Delete',
// }

// Phần them vào prop của People là một đối tượng people
// export type TPeople = {
//   peopleId?: number;
//   gender: string;
//   age: number;
//   peopleName: string;
//   idNumber: string;
// };

// tóm lại, thông tin truyền vào modal là TPeople va BaseModalProps

//Khi truyền vào function component, có thể truyền hết cũng có thể dùng destructing object
// Cách thông thường (không sử dụng destructuring):

// const PeopleModal = (props) => {
//   return (
//     <div>
//       <h1>{props.title}</h1>
//       {props.isOpen ? <p>Modal is Open</p> : <p>Modal is Closed</p>}
//     </div>
//   );
// };


// Sử dụng ES6 destructuring:
// const PeopleModal = ({ title, isOpen, people, onOpenChange }) => {
//   return (
//     <div>
//       <h1>{title}</h1>
//       {isOpen ? <p>Modal is Open</p> : <p>Modal is Closed</p>}
//     </div>
//   );
// };
// Ở đây, { title, isOpen, people, onOpenChange } là destructuring từ đối tượng props, giúp truy cập các giá trị trực tiếp mà không cần sử dụng props.title, props.isOpen, v.v.
