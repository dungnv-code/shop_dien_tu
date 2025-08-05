export const toSlug = (text) => {
    return text
        .toLowerCase()
        .normalize("NFD") // chuyển ký tự có dấu thành không dấu
        .replace(/[\u0300-\u036f]/g, "") // loại bỏ dấu
        .replace(/đ/g, "d") // chuyển đ thành d
        .replace(/[^a-z0-9 -]/g, "") // loại ký tự đặc biệt
        .replace(/\s+/g, "-") // thay khoảng trắng bằng dấu gạch ngang
        .replace(/-+/g, "-") // gộp nhiều dấu - liên tiếp
        .replace(/^-+|-+$/g, ""); // xóa dấu - ở đầu và cuối
};
