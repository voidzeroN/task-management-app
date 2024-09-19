document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('taskList');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskForm = document.getElementById('taskForm');
    const formTitle = document.getElementById('formTitle');
    const taskInput = document.getElementById('taskInput');
    const dateInput = document.getElementById('dateInput');
    const saveTaskBtn = document.getElementById('saveTaskBtn');
    const cancelTaskBtn = document.getElementById('cancelTaskBtn');
    let editIndex = null;

    let tasks = JSON.parse(getCookie('tasks') || '[]');

    function displayTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.classList.add('animated');
            const remainingTime = calculateRemainingTime(task.date);
            li.innerHTML = `
                <span class="task-details ${task.isCompleted ? 'complete' : ''}">${task.task} (${task.date}) - ${remainingTime}</span>
                <div class="task-actions">
                    <button onclick="editTask(${index})">編集</button>
                    <button onclick="deleteTask(${index})">削除</button>
                    <button onclick="toggleComplete(${index})">完了</button>
                </div>
            `;
            taskList.appendChild(li);
        });
    }

    addTaskBtn.addEventListener('click', () => {
        taskForm.classList.remove('hidden');
        addTaskBtn.classList.add('hidden');
        resetForm();
    });

    saveTaskBtn.addEventListener('click', () => {
        const task = {
            task: taskInput.value,
            date: dateInput.value,
            isCompleted: false
        };
        if (editIndex !== null) {
            tasks[editIndex] = task;
        } else {
            tasks.push(task);
        }
        setCookie('tasks', JSON.stringify(tasks), 7);
        displayTasks();
        taskForm.classList.add('hidden');
        addTaskBtn.classList.remove('hidden');
        resetForm();
    });

    cancelTaskBtn.addEventListener('click', () => {
        taskForm.classList.add('hidden');
        addTaskBtn.classList.remove('hidden');
        resetForm();
    });

    window.editTask = function (index) {
        formTitle.textContent = 'タスク編集中';
        formTitle.classList.remove('new-task');
        formTitle.classList.add('editing-task');
        const task = tasks[index];
        taskInput.value = task.task;
        dateInput.value = task.date;
        taskForm.classList.remove('hidden');
        addTaskBtn.classList.add('hidden');
        editIndex = index;
    };

    window.deleteTask = function (index) {
        tasks.splice(index, 1);
        setCookie('tasks', JSON.stringify(tasks), 7);
        displayTasks();
    };

    window.toggleComplete = function (index) {
        tasks[index].isCompleted = !tasks[index].isCompleted;
        setCookie('tasks', JSON.stringify(tasks), 7);
        displayTasks();
    };

    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function calculateRemainingTime(date) {
        const now = new Date();
        const dueDate = new Date(date);
        const diffTime = dueDate - now;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
        if (diffDays > 0) {
            return `残り${diffDays}日と${diffHours}時間`;
        } else if (diffHours > 0) {
            return `残り${diffHours}時間と${diffMinutes}分`;
        } else if (diffMinutes > 0) {
            return `残り${diffMinutes}分`;
        } else {
            return `時間切れ`;
        }
    }

    function resetForm() {
        formTitle.textContent = '新しいタスクを追加';
        formTitle.classList.remove('editing-task');
        formTitle.classList.add('new-task');
        taskInput.value = '';
        dateInput.value = '';
        editIndex = null;
    }

    displayTasks();
});
