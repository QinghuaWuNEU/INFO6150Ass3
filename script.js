// 等待整个 HTML 文档加载完毕
document.addEventListener('DOMContentLoaded', function() {

    // --- 1. 元素选择 ---
    const addStudentBtn = document.getElementById('addStudentBtn');
    const submitBtn = document.getElementById('submitBtn');
    const tableBody = document.querySelector('#studentTable tbody');
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');

    // --- UTILITY FUNCTION: 更新 Submit 按钮状态 ---
    // 要求 7b 和 10b：管理 Submit 按钮的启用/禁用和样式
    function updateSubmitButtonState() {
        // 查找所有被选中的行复选框
        const selectedCheckboxes = tableBody.querySelectorAll('.row-checkbox:checked');
        
        if (selectedCheckboxes.length > 0) {
            // 要求 7b: 启用，移除禁用样式
            submitBtn.disabled = false;
            submitBtn.classList.remove('disabled-button');
        } else {
            // 要求 10b: 禁用，添加禁用样式
            submitBtn.disabled = true;
            submitBtn.classList.add('disabled-button');
        }
        
        // 更新 '全选' 复选框的状态
        const allCheckboxes = tableBody.querySelectorAll('tr:not(.expandable-row) .row-checkbox');
        // 只有当所有数据行都选中时，'全选'才被选中
        selectAllCheckbox.checked = allCheckboxes.length > 0 && selectedCheckboxes.length === allCheckboxes.length;
    }

    // --- UTILITY FUNCTION: 重新排序学生编号 (要求 5c) ---
    // 在添加和删除操作后调用，确保编号是连续的
    function reorderStudentNumbers() {
        // 仅选择数据行（非可展开行）
        const studentRows = tableBody.querySelectorAll('tr:not(.expandable-row)');
        
        studentRows.forEach((dataRow, index) => {
            const studentNumber = index + 1; // 新的学生编号
            const studentNameCell = dataRow.children[1]; // 学生姓名单元格
            const teacherNameCell = dataRow.children[2]; // 老师姓名单元格
            
            // 更新学生姓名和老师姓名
            studentNameCell.textContent = `Student ${studentNumber}`;
            teacherNameCell.textContent = `Teacher ${studentNumber}`;
            
            // 找到并更新关联的可展开行内容
            const expandableRow = dataRow.nextElementSibling;
            if (expandableRow && expandableRow.classList.contains('expandable-row')) {
                const detailCell = expandableRow.querySelector('td');
                detailCell.textContent = `Details for Student ${studentNumber}: More information here...`;
            }
        });
    }

    // --- UTILITY FUNCTION: 获取下一个学生编号 ---
    function getNextStudentNumber() {
        const existingStudentRows = tableBody.querySelectorAll('tr:not(.expandable-row)');
        // 现有行数 + 1 即为下一个编号
        return existingStudentRows.length + 1;
    }



});