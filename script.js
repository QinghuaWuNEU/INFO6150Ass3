// 等待整个 HTML 文档加载完毕
document.addEventListener('DOMContentLoaded', function() {

    // --- 1. 元素选择 ---
    const addStudentBtn = document.getElementById('addStudentBtn');
    const submitBtn = document.getElementById('submitBtn');
    const tableBody = document.querySelector('#studentTable tbody');
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');

    // --- UTILITY FUNCTION: 更新 Submit 按钮状态 (要求 7b, 10b) ---
    function updateSubmitButtonState() {
        // 查找所有被选中的行复选框
        const selectedCheckboxes = tableBody.querySelectorAll('.row-checkbox:checked');
        
        if (selectedCheckboxes.length > 0) {
            // 要求 7b: 启用，移除禁用样式 (Submit 按钮变橙色)
            submitBtn.disabled = false;
            submitBtn.classList.remove('disabled-button');
        } else {
            // 要求 10b: 禁用，添加禁用样式 (Submit 按钮变灰色)
            submitBtn.disabled = true;
            submitBtn.classList.add('disabled-button');
        }
        
        // 更新 '全选' 复选框的状态
        const allCheckboxes = tableBody.querySelectorAll('tr:not(.expandable-row) .row-checkbox');
        // 只有当所有数据行都选中时，'全选'才被选中
        selectAllCheckbox.checked = allCheckboxes.length > 0 && selectedCheckboxes.length === allCheckboxes.length;
    }

    // --- UTILITY FUNCTION: 重新排序学生编号 (要求 5c) ---
    function reorderStudentNumbers() {
        const studentRows = tableBody.querySelectorAll('tr:not(.expandable-row)');
        
        studentRows.forEach((dataRow, index) => {
            const studentNumber = index + 1; // 新的学生编号
            const studentNameCell = dataRow.children[1]; // 学生姓名单元格
            const teacherNameCell = dataRow.children[2]; // 老师姓名单元格
            
            // 更新学生姓名和老师姓名（动态值）
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
        return existingStudentRows.length + 1;
    }


    // --- 2. 动态按钮功能 (要求 7c, 7d, 8, 9) ---

    // 在选中复选框时创建和绑定 Delete/Edit 按钮
    function addDynamicButtons(dataRow, deleteCell, editCell) {
        
        // 获取学生姓名
        const studentName = dataRow.children[1].textContent.trim();

        // 7c: 创建并添加 Delete 按钮
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        // 使用行内样式满足要求，也可以通过CSS类实现
        deleteBtn.style.cssText = 'background-color: #dc3545; color: white; padding: 5px 8px; border: none; border-radius: 5px; cursor: pointer; margin-right: 5px;';
        deleteCell.innerHTML = ''; 
        deleteCell.appendChild(deleteBtn);

        // 7d: 创建并添加 Edit 按钮
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.style.cssText = 'background-color: #007bff; color: white; padding: 5px 8px; border: none; border-radius: 5px; cursor: pointer;';
        editCell.innerHTML = ''; 
        editCell.appendChild(editBtn);


        // 8: Delete 功能
        deleteBtn.addEventListener('click', function(event) {
            event.stopPropagation(); // 防止事件冒泡
            
            // 找到并移除关联的可展开行
            const expandableRow = dataRow.nextElementSibling;

            // 移除数据行
            dataRow.remove();
            // 移除可展开行
            if (expandableRow && expandableRow.classList.contains('expandable-row')) {
                expandableRow.remove();
            }

            // 重新排序学生编号 (要求 5c)
            reorderStudentNumbers();
            
            // 更新 Submit 按钮状态 (可能清空了所有选中项)
            updateSubmitButtonState();

            // 显示成功消息 (要求 8)
            alert(`${studentName} Record deleted successfully`);
        });

        // 9: Edit 功能
        editBtn.addEventListener('click', function(event) {
            event.stopPropagation(); // 阻止事件冒泡
            
            // 显示提示框 (要求 9a, 9b, 9c)
            const userInput = prompt(`Edit details of ${studentName}\n\nEnter new details:`, '');

            if (userInput !== null) { // 用户点击了 OK
                if (userInput.trim() !== '') {
                    // 要求 9d: 如果输入框有数据，显示更新成功消息
                    alert(`${studentName} data updated successfully`);
                }
            } 
            // 如果用户点击 'Cancel' (userInput 为 null)，则关闭，符合要求。
        });
    }
    
    // --- 3. 行监听器设置 ---

    // 绑定所有必要的事件监听器到数据行及其详情行
    function attachRowListeners(dataRow, detailRow) {
        
        // 获取复选框和箭头元素
        const checkbox = dataRow.querySelector('.row-checkbox');
        const arrowSpan = dataRow.querySelector('.arrow');
        
        // 监听复选框变化 (要求 7, 10)
        checkbox.addEventListener('change', function() {
            // 获取动态按钮所在的单元格
            const deleteCell = dataRow.querySelector('.column-delete');
            const editCell = dataRow.querySelector('.column-edit');
            
            if (this.checked) {
                // 要求 7a: 突出显示行（背景色变黄）
                dataRow.classList.add('selected-row');

                // 要求 7c, 7d: 添加 Delete 和 Edit 按钮
                addDynamicButtons(dataRow, deleteCell, editCell);

            } else {
                // 要求 10a: 移除行高亮（背景色变回白色）
                dataRow.classList.remove('selected-row');

                // 要求 10c: 隐藏 Delete 和 Edit 按钮
                deleteCell.innerHTML = '';
                editCell.innerHTML = '';
            }
            
            // 更新 Submit 按钮状态 (要求 10b)
            updateSubmitButtonState();
        });

        // 监听箭头点击 (要求 11: 切换展开/折叠)
        arrowSpan.addEventListener('click', function() {
            // 假设 arrowSpan 内部有一个 img 标签
            const arrowImg = this.querySelector('img'); 

            if (detailRow.style.display === 'table-row') {
                detailRow.style.display = 'none'; // 隐藏 -> 折叠
                if (arrowImg) {
                    arrowImg.src = 'arrow_right.png'; // 切换为向右箭头图片
                    arrowImg.alt = 'Expand';
                }
            } else {
                detailRow.style.display = 'table-row'; // 显示 -> 展开
                if (arrowImg) {
                    arrowImg.src = 'arrow_down.png'; // 切换为向下箭头图片
                    arrowImg.alt = 'Collapse';
                }
            }
        });
        
        // 要求 2a: 确保在页面加载时，所有 expandable-row 都是折叠状态
        if (detailRow) {
            detailRow.style.display = 'none';
        }
    }

    // --- 4. 添加新学生按钮 (要求 5, 6) ---
    addStudentBtn.addEventListener('click', function() {
        
        try {
            const newStudentNumber = getNextStudentNumber();
            
            // 创建新的数据行和可展开行
            const newRow = document.createElement('tr');
            const expandableRow = document.createElement('tr');
            expandableRow.classList.add('expandable-row'); 

            // 填充 HTML 内容 (初始 Delete 和 Edit 单元格为空)
            newRow.innerHTML = `
                <td><input type="checkbox" class="row-checkbox"></td>
                <td>Student ${newStudentNumber}</td>
                <td>Teacher ${newStudentNumber}</td>
                <td>Merit</td>
                <td>Fall</td>
                <td>Computer Science</td>
                <td class="column-delete"></td> 
                <td class="column-edit"></td> 
                <td><span class="arrow"><img src="arrow_right.png" alt="Expand" style="width: 20px; height: 20px; vertical-align: middle;"></span></td>
            `;

            expandableRow.innerHTML = `
                <td colspan="9">Details for Student ${newStudentNumber}: More information here...</td>
            `;

            // 添加到表格
            tableBody.appendChild(newRow);
            tableBody.appendChild(expandableRow);
            
            // 绑定事件监听器到新行
            attachRowListeners(newRow, expandableRow);
            
            // 重新检查并编号所有学生
            reorderStudentNumbers();
            
            // 显示成功消息 (要求 6)
            alert(`Student ${newStudentNumber} Record added successfully`);

        } catch (error) {
            // 显示错误消息 (要求 6)
            console.error('Failed to add student record:', error);
            alert('Error: Failed to add student record.');
        }
    });

    // --- 5. 全选复选框逻辑 ---
    selectAllCheckbox.addEventListener('change', function() {
        const allCheckboxes = tableBody.querySelectorAll('tr:not(.expandable-row) .row-checkbox');
        const isChecked = this.checked;

        allCheckboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
            // 触发 'change' 事件，以应用样式和添加/移除按钮
            const event = new Event('change');
            checkbox.dispatchEvent(event); 
        });
    });

    // --- 6. 页面初始化 ---

    // 对页面加载时已存在的行绑定监听器
    const initialRows = tableBody.querySelectorAll('tr:not(.expandable-row)');
    initialRows.forEach(dataRow => {
        const detailRow = dataRow.nextElementSibling;
        attachRowListeners(dataRow, detailRow);
    });
    
    // 初始化 Submit 按钮状态 (要求 2b)
    updateSubmitButtonState();
});