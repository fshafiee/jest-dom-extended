import { render } from './helpers/test-utils.js'

test('it should work as expected', () => {
  const { queryByTestId } = render(`
    <select id="fruits" data-testid="select">
      <option value="">Select a fruit...</option>
      <option value="ananas">Ananas</option>
      <option value="banana">Banana</option>
      <option value="avocado">Avocado</option>
    </select>
  `)

  expect(queryByTestId('select')).toHaveDisplayValue('Select a fruit...')
  expect(queryByTestId('select')).not.toHaveDisplayValue('Select')
  expect(queryByTestId('select')).not.toHaveDisplayValue('Banana')
  expect(() =>
    expect(queryByTestId('select')).not.toHaveDisplayValue('Select a fruit...'),
  ).toThrow()
  expect(() =>
    expect(queryByTestId('select')).toHaveDisplayValue('Ananas'),
  ).toThrow()

  const selectElement = queryByTestId('select') as HTMLSelectElement
  selectElement.value = 'banana'
  expect(queryByTestId('select')).toHaveDisplayValue('Banana')
  expect(queryByTestId('select')).toHaveDisplayValue(/[bB]ana/)
})

describe('with multiple select', () => {
  function mount() {
    return render(`
      <select id="fruits" data-testid="select" multiple>
        <option value="">Select a fruit...</option>
        <option value="ananas" selected>Ananas</option>
        <option value="banana">Banana</option>
        <option value="avocado" selected>Avocado</option>
      </select>
    `)
  }

  it('matches only when all the multiple selected values are equal to all the expected values', () => {
    const subject = mount()
    expect(subject.queryByTestId('select')).toHaveDisplayValue([
      'Ananas',
      'Avocado',
    ])
    expect(() =>
      expect(subject.queryByTestId('select')).not.toHaveDisplayValue([
        'Ananas',
        'Avocado',
      ]),
    ).toThrow()
    expect(subject.queryByTestId('select')).not.toHaveDisplayValue([
      'Ananas',
      'Avocado',
      'Orange',
    ])
    expect(subject.queryByTestId('select')).not.toHaveDisplayValue('Ananas')
    expect(() =>
      expect(subject.queryByTestId('select')).toHaveDisplayValue('Ananas'),
    ).toThrow()

    const selectElement = subject.queryByTestId('select') as HTMLSelectElement
    Array.from(selectElement.options).forEach(option => {
      option.selected = ['ananas', 'banana'].includes(option.value)
    })

    expect(subject.queryByTestId('select')).toHaveDisplayValue([
      'Ananas',
      'Banana',
    ])
  })

  it('matches even when the expected values are unordered', () => {
    const subject = mount()
    expect(subject.queryByTestId('select')).toHaveDisplayValue([
      'Avocado',
      'Ananas',
    ])
  })

  it('matches with regex expected values', () => {
    const subject = mount()
    expect(subject.queryByTestId('select')).toHaveDisplayValue([
      /[Aa]nanas/,
      'Avocado',
    ])
  })
})

test('it should work with input elements', () => {
  const { queryByTestId } = render(`
    <input type="text" data-testid="input" value="Luca" />
  `)

  expect(queryByTestId('input')).toHaveDisplayValue('Luca')
  expect(queryByTestId('input')).toHaveDisplayValue(/Luc/)

  const inputElement = queryByTestId('input') as HTMLInputElement
  inputElement.value = 'Piero'
  expect(queryByTestId('input')).toHaveDisplayValue('Piero')
})

test('it should work with textarea elements', () => {
  const { queryByTestId } = render(
    '<textarea data-testid="textarea-example">An example description here.</textarea>',
  )

  const textareaElement = queryByTestId(
    'textarea-example',
  ) as HTMLTextAreaElement

  expect(textareaElement).toHaveDisplayValue('An example description here.')
  expect(textareaElement).toHaveDisplayValue(/example/)

  textareaElement.value = 'Another example'
  expect(queryByTestId('textarea-example')).toHaveDisplayValue(
    'Another example',
  )
})

test('it should throw if element is not valid', () => {
  const { queryByTestId } = render(`
    <div data-testid="div">Banana</div>
    <input type="radio" data-testid="radio" value="Something" />
    <input type="checkbox" data-testid="checkbox" />
  `)

  let errorMessage
  try {
    expect(queryByTestId('div')).toHaveDisplayValue('Banana')
  } catch (err) {
    errorMessage = err.message
  }

  expect(errorMessage).toEqual(
    `.toHaveDisplayValue() currently supports only input, textarea or select elements, try with another matcher instead.`,
  )

  try {
    expect(queryByTestId('radio')).toHaveDisplayValue('Something')
  } catch (err) {
    errorMessage = err.message
  }

  expect(errorMessage).toEqual(
    `.toHaveDisplayValue() currently does not support input[type="radio"], try with another matcher instead.`,
  )

  try {
    expect(queryByTestId('checkbox')).toHaveDisplayValue(
      true as unknown as string,
    )
  } catch (err) {
    errorMessage = err.message
  }

  expect(errorMessage).toEqual(
    `.toHaveDisplayValue() currently does not support input[type="checkbox"], try with another matcher instead.`,
  )
})

test('it should work with numbers', () => {
  const { queryByTestId } = render(`
    <select data-testid="select">
      <option value="">1</option>
    </select>
  `)

  expect(queryByTestId('select')).toHaveDisplayValue(1)
})
