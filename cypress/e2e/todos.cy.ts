describe('Todos page', () => {
  beforeEach(() => {
    cy.visit('/todos')
  })

  it('has correct title', () => {
    cy.contains('Todos').should('be.visible')
  })

  it('can add single todo', () => {
    const todoName = 'Buy milk'
    cy.contains('No todos found. Please add a todo.').should('be.visible')
    cy.get('input[name="create-todo"]').type(todoName)
    cy.get('button').contains('Add').click()
    cy.contains(todoName).should('be.visible')
    cy.contains('No todos found. Please add a todo.').should('not.exist')
  })

  it('can add multiple todos', () => {
    const todoNames = ['Do laundry', 'Buy groceries', 'Clean house']
    todoNames.forEach((todoName) => {
      cy.get('input[name="create-todo"]').type(todoName)
      cy.get('button').contains('Add').click()
    })

    todoNames.forEach((todoName) => {
      cy.contains(todoName).should('be.visible')
    })

    cy.contains(todoNames.length.toString()).should('be.visible')
    cy.get('table tbody tr').should('have.length', todoNames.length)
  })

  it('can edit single todo', () => {
    const oldTodoName = 'Bake bread'
    const newTodoName = 'Toast bread'
    cy.get('input[name="create-todo"]').type(oldTodoName)
    cy.get('button').contains('Add').click()

    cy.get('button[name="save-todo"]').should('be.disabled')

    cy.contains(oldTodoName).should('be.visible')
    cy.contains(oldTodoName).dblclick()
    cy.get('button[name="save-todo"]').should('not.be.disabled')

    cy.get('input[name="edit-todo"]').type('{selectall}{backspace}')
    cy.get('button[name="save-todo"]').should('be.disabled')
    cy.get('input[name="edit-todo"]').type(newTodoName)

    cy.get('button[name="save-todo"]').should('not.be.disabled')
    cy.get('button[name="save-todo"]').click()

    cy.get('div[role="alert"]').should('be.visible').and('contain', 'Todo updated')
    cy.get('.Toastify__toast').find('button').click()

    cy.contains(newTodoName).should('be.visible')
    cy.contains(oldTodoName).should('not.exist')
  })

  it('can edit multiple todos', () => {
    const todoNames = [
      { oldName: 'Bake bread', newName: 'Toast bread' },
      { oldName: 'Do laundry', newName: 'Fold clothes' },
      { oldName: 'Mop floor', newName: 'Wash dishes' }
    ]
    todoNames.forEach((todoName) => {
      cy.get('input[name="create-todo"]').type(todoName.oldName)
      cy.get('button').contains('Add').click()
    })

    todoNames.forEach((todoName, index) => {
      cy.contains(todoName.oldName).should('be.visible')
      cy.contains(todoName.oldName).dblclick()
      cy.get('input[name="edit-todo"]').type(`{selectall}{backspace}${todoName.newName}`)
      cy.get('button[name="save-todo"]').eq(index).click()
      cy.contains(todoName.newName).should('be.visible')
    })
  })

  it('can delete single todo', () => {
    const todoName = 'Buy milk'
    cy.get('input[name="create-todo"]').type(todoName)
    cy.get('button').contains('Add').click()
    cy.contains(todoName).should('be.visible')
    cy.get('button[name="delete-todo"]').click()
    cy.contains(todoName).should('not.exist')
    cy.get('div[role="alert"]').should('be.visible').and('contain', 'Todo deleted')
    cy.get('.Toastify__toast').find('button').click()
    cy.contains(todoName).should('not.exist')
  })

  it('can delete multiple todos', () => {
    cy.contains('No todos found. Please add a todo.').should('be.visible')
    const todoNames = ['Run 5km', 'Read 10 pages', 'Write 1000 words']
    todoNames.forEach((todoName) => {
      cy.get('input[name="create-todo"]').type(todoName)
      cy.get('button').contains('Add').click()
    })

    todoNames.forEach((todoName) => {
      cy.contains(todoName).should('be.visible')
    })

    cy.contains('No todos found. Please add a todo.').should('not.exist')
    cy.get('table tbody tr').should('have.length', todoNames.length)

    todoNames.forEach((todoName, index) => {
      cy.get('button[name="delete-todo"]').first().click()
      cy.get('div[role="alert"]').should('be.visible').and('contain', 'Todo deleted')
      cy.get('table tbody tr').should('have.length', todoNames.length - index - 1)
    })

    cy.contains('No todos found. Please add a todo.').should('be.visible')
  })

  it('can persist todos', () => {
    const todoName = 'Buy cheese'
    cy.contains('No todos found. Please add a todo.').should('be.visible')
    cy.get('input[name="create-todo"]').type(todoName)
    cy.get('button').contains('Add').click()
    cy.contains(todoName).should('be.visible')
    cy.contains('No todos found. Please add a todo.').should('not.exist')

    cy.reload()

    cy.contains(todoName).should('be.visible')
    cy.contains('No todos found. Please add a todo.').should('not.exist')

    cy.get('button[name="delete-todo"]').first().click()
    cy.contains(todoName).should('not.exist')

    cy.reload()

    cy.contains('No todos found. Please add a todo.').should('be.visible')
  })
})
