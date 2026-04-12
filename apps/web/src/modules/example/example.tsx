import React, { useState } from 'react';

const ExamplePage: React.FC = () => {
    // Khởi tạo một state (trạng thái) với tên 'count' và hàm setCount để cập nhật giá trị của 'count'.
    // useState(0) nghĩa là giá trị ban đầu của count là 0.
    const [count, setCount] = useState(0);

    // Hàm này sẽ được gọi khi người dùng nhấn nút.
    const handleButtonClick = () => {
        setCount(count + 1);
    };

    return (
        <div>
            <h1>Count: {count}</h1>
            {/* Khi nhấn nút, hàm handleButtonClick sẽ được gọi */}
            <button onClick={handleButtonClick}>Nhấn để tăng count</button>
        </div>
    );
};

export default ExamplePage;
