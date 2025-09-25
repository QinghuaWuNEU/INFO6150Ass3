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

});