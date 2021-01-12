window.onload = function () {
    setInterval(renderContent, 4000)
    renderContent()
    const disable = document.getElementById('disable')

    // add the ability to disable the api - pretend it is unavailable
    disable.addEventListener('click', async (evt) => {
        evt.preventDefault()
        let response = await fetch('/api/toggle-disable')
        let value = await response.json()
        evt.target.checked = value
    })
}

async function renderContent () {
    const crmApp = document.getElementById('crm-app')
    const data = await fetch('/api/users')
    const users = await data.json()
    const newContent = pageContent(users)
    crmApp.innerHTML = newContent
}

function pageContent (users) {
    return (`
        <div class="container">
            <div class="section">
                ${users.map(user => userCard(user))}
            </div>
        </div>
    `)
}

async function deleteUser (id) {
    await fetch(`/api/users/${id}`, {
        method: 'DELETE',
    })
    const userCard = [...document.querySelectorAll(`[data-id="${id}"]`)]
    userCard[0].remove()
}

function userCard (user) {
    return (`
        <div class="column" data-id="${user.user_id}">
            <div class="card has-background-warning">
                <div class="card-content">
                    <div class="level">
                        <div class="level-left">
                            <div class="level-item has-text-weight-bold">ID</div>
                        </div>
                        <div class="level-right">
                            <div class="level-item">${user.user_id}</div>
                        </div>
                    </div>
                    <div class="level">
                        <div class="level-left">
                            <div class="level-item has-text-weight-bold">Forename</div>
                        </div>
                        <div class="level-right">
                            <div class="level-item">${user.forename}</div>
                        </div>
                    </div>
                    <div class="level">
                        <div class="level-left">
                            <div class="level-item has-text-weight-bold">Surname</div>
                        </div>
                        <div class="level-right">
                            <div class="level-item">${user.surname}</div>
                        </div>
                    </div>
                    <div class="level">
                        <div class="level-left">
                            <div class="level-item has-text-weight-bold">Email</div>
                        </div>
                        <div class="level-right">
                            <div class="level-item">${user.email}</div>
                        </div>
                    </div>
                    <button class="button has-background-danger has-text-white" onclick="deleteUser('${user.user_id}')">Delete</button>
                </div>
            </div>
        </div>
    `)
}