const APIURL = 'https://api.github.com/users/';
const form = document.getElementById('form');
const search = document.getElementById('search');
const avatar = document.querySelector('.avatar');
const userInfo = document.querySelector('.user-info');
const main = document.getElementById('main');

function getUser(username) {
  axios(APIURL + username)
    .then(res => handleGetUser(res))
    .catch(err => createErrorCard(err));

  getReposByUsername(username);
}

function getReposByUsername(username) {
  axios(APIURL + username + '/repos?sort=created')
    .then(res => handleGetRepos(res))
    .catch(err => createErrorCard(err, 'Problem fetching repos'));
}

function handleGetRepos(res) {
  const { data } = res;
  const reposEl = document.getElementById('repos');

  data
    .slice(0, 3)
    .forEach(repo => {
    const repoEl = document.createElement('a');
    repoEl.classList.add('repo');
    repoEl.href = repo.html_url;
    repoEl.target = '_blank';
    repoEl.innerText = repo.name;
    reposEl.appendChild(repoEl);
  });
}

function createErrorCard(error, msg) {
  if (!msg && error.response.status === 404) {
    msg = 'There is no user with this profile name';
  }
  const cardHtml = `
  <div class="card">
      <h1>${msg}</h1>
  </div>
  `;
  main.innerHTML = cardHtml;
}

function handleGetUser(res) {
  const { data } = res;
  createUserCard(data);
}

function createUserCard(user) {
  const cardHtml = `
      <div class="card hidden">
      <div>
          <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
      </div>

      <div class="user-info">
          <h2>${user.name}</h2>
          <p>${user.bio ? user.bio : ''}</p>

          <ul>
            <li>${user.followers}<strong>Followers</strong></li>
            <li>${user.following}<strong>Following</strong></li>
            <li>${user.public_repos}<strong>Repos</strong></li>
          </ul>

          <div id="repos"></div>
      </div>
    </div>`;
    main.innerHTML = cardHtml;
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const user = search.value;
  if (user) {
    getUser(user);
    search.value = '';
  }
});

