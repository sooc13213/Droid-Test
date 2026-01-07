// app.js

// Giriş ve Kayıt Ekranı Gösterme
document.getElementById('registerBtn').addEventListener('click', function() {
  document.getElementById('authPanel').style.display = 'none';
  document.getElementById('register').style.display = 'block';
});

document.getElementById('loginBtn').addEventListener('click', function() {
  document.getElementById('authPanel').style.display = 'none';
  document.getElementById('login').style.display = 'block';
});

// Geri Dön Butonları
document.getElementById('backToAuth').addEventListener('click', function() {
  document.getElementById('register').style.display = 'none';
  document.getElementById('authPanel').style.display = 'block';
});

document.getElementById('backToAuthLogin').addEventListener('click', function() {
  document.getElementById('login').style.display = 'none';
  document.getElementById('authPanel').style.display = 'block';
});

// Kayıt Olma
document.getElementById('registerForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const username = document.getElementById('registerUsername').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  const response = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });

  const data = await response.json();
  if (data.success) {
    alert('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
    document.getElementById('register').style.display = 'none';
    document.getElementById('login').style.display = 'block';
  } else {
    alert(data.message);
  }
});

// Giriş Yapma
document.getElementById('loginForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.token);
    alert('Giriş başarılı!');
    loadCourses();
  } else {
    alert(data.message);
  }
});

// Dersleri Yükle
async function loadCourses() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Lütfen giriş yapın.');
    return;
  }

  // Dersleri API'den alıyoruz
  const response = await fetch('/api/courses', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const courses = await response.json();
  const coursesContainer = document.getElementById('courses');
  coursesContainer.innerHTML = '';

  courses.forEach(course => {
    const button = document.createElement('button');
    button.classList.add('course-btn');
    button.textContent = course.name;
    button.addEventListener('click', () => loadTests(course.id));
    coursesContainer.appendChild(button);
  });

  document.getElementById('coursesPage').style.display = 'block';
  document.getElementById('authPanel').style.display = 'none';
  document.getElementById('login').style.display = 'none';
}

// Testleri Yükle
async function loadTests(courseId) {
  const token = localStorage.getItem('token');
  const response = await fetch(`/api/courses/${courseId}/tests`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const tests = await response.json();
  alert(`Bu dersin testleri: ${tests.map(test => test.name).join(', ')}`);
}
