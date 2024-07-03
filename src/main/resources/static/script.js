document.addEventListener('DOMContentLoaded', ()=>{
    const form = document.getElementById('employee-form');
    const tableBody = document.querySelector('#employee-table tbody');
    form.addEventListener('submit', async (event) =>{
        event.preventDefault();

        const employeeId = document.getElementById('employeeId').value;
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const salery = document.getElementById('salery').value;
        const department = document.getElementById('department').value;
        const address = document.getElementById('address').value;

        const employee={
            firstName, lastName, email, salery, department, address
        };

        if(employeeId){
            await updateEmployee(employeeId, employee)
        }else{
            await createEmployee(employee);
        }

        form.reset();
        loadEmployees();
    });

    tableBody.addEventListener('click', async(event)=>{
        if(event.target.classList.contains('edit')){
            const row = event.target.closest('tr');
            const employeeId = row.dataset.id;

            const employee = await getEmployee(employeeId);

            document.getElementById('employeeId').value = employee.id;
            document.getElementById('firstName').value = employee.firstName;
            document.getElementById('lastName').value = employee.lastName;
            document.getElementById('email').value = employee.email;
            document.getElementById('salery').value = employee.salery;
            document.getElementById('department').value = employee.department;
            document.getElementById('address').value = employee.address;

        }

        if(event.target.classList.contains('delete')){
            const row = event.target.closest('tr');
            const employeeId = row.dataset.id;

            await deleteEmployee(employeeId);
            loadEmployees();
        }
    });

    async function loadEmployees(){
        const response = await fetch('/api/employees');
        const employees = await response.json();
        tableBody.innerHTML = '';
        employees.forEach(employee => {
        const row = document.createElement('tr');
        row.dataset.id = employee.id;
        row.innerHTML=`
            <td>${employee.id}</td>
            <td>${employee.firstName}</td>
            <td>${employee.lastName}</td>
            <td>${employee.email}</td>
            <td>${employee.salery}</td>
            <td>${employee.department}</td>
            <td>${employee.address}</td>
            <td>
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
        });
    }

    async function createEmployee(employee){
        await fetch('/api/employees', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(employee)
        });
    }

    async function updateEmployee(id, employee){
    await fetch(`/api/employees/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(employee)
    });
    }

    async function getEmployee(id){
        return fetch(`/api/employees/${id}`).then(response => response.json());
    }

    async function deleteEmployee(id){
        await fetch(`/api/employees/${id}`, {
            method: 'DELETE'
        });
    }

    loadEmployees();
});