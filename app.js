let users = [];
let selectedUser = null;
let image = null;

document.addEventListener('DOMContentLoaded', () => {
  fetchUsers();
  document.getElementById('addUserBtn').addEventListener('click', openAddPopup);
  document.getElementById('addForm').addEventListener('submit', submitAdd);
  document.getElementById('editForm').addEventListener('submit', submitEdit);
  document.getElementById('addImage').addEventListener('change', handleFileChange);
  document.getElementById('editImage').addEventListener('change', handleFileChange);
});

function fetchUsers() {
  fetch('https://user-api-x2uk.onrender.com/users')
    .then(response => response.json())
    .then(data => {
      users = data;
      renderUsers();
    })
    .catch(error => console.error('Error fetching users:', error));
}

function renderUsers() {
  const userList = document.getElementById('userList');
  userList.innerHTML = '';
  users.forEach(user => {
    const li = document.createElement('li');
    li.classList.add('user-card');
    li.innerHTML = `
      <div class="user-info">
        ${user.imageUrl ? `<img src="${user.imageUrl}" alt="user image" />` : ''}
        <p><strong>${user.name}</strong></p>
        <p>Email: ${user.email}</p>
      </div>
      <div class="user-actions">
        <button onclick="openEditPopup('${user._id}')">Edit</button>
        <button onclick="deleteUser('${user._id}')">Delete</button>
      </div>
    `;
    userList.appendChild(li);
  });
}

function openAddPopup() {
  document.getElementById('addModal').style.display = 'block';
}

function closeAddPopup() {
  document.getElementById('addModal').style.display = 'none';
}

function openEditPopup(userId) {
  selectedUser = users.find(user => user._id === userId);
  document.getElementById('editName').value = selectedUser.name;
  document.getElementById('editEmail').value = selectedUser.email;
  document.getElementById('editModal').style.display = 'block';
}

function closeEditPopup() {
  document.getElementById('editModal').style.display = 'none';
  selectedUser = null;
}

function handleFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      image = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function submitAdd(event) {
  event.preventDefault();
  const name = document.getElementById('addName').value;
  const email = document.getElementById('addEmail').value;

  fetch('https://user-api-x2uk.onrender.com/post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name,
      email: email,
      imageUrl: image,
    }),
  })
    .then(response => response.json())
    .then(data => {
      users.push(data);
      renderUsers();
      closeAddPopup();
    })
    .catch(error => console.error('Error adding user:', error));
}

function submitEdit(event) {
  event.preventDefault();
  const name = document.getElementById('editName').value;
  const email = document.getElementById('editEmail').value;

  fetch(`https://user-api-x2uk.onrender.com/update/${selectedUser._id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name,
      email: email,
      imageUrl: image || selectedUser.imageUrl,
    }),
  })
    .then(response => response.json())
    .then(() => {
      fetchUsers();
      closeEditPopup();
    })
    .catch(error => console.error('Error updating user:', error));
}

function deleteUser(userId) {
  fetch(`https://user-api-x2uk.onrender.com/delete/${userId}`, {
    method: 'DELETE',
  })
    .then(() => {
      users = users.filter(user => user._id !== userId);
      renderUsers();
    })
    .catch(error => console.error('Error deleting user:', error));
}
