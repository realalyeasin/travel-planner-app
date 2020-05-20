import submitHandler from '../src/client/js/app'

test('expect its a defined func', () => {
  expect(
    submitHandler()
    ).toBeDefined()
})