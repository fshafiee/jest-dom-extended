import { render } from './helpers/test-utils.js'
import { document } from './helpers/document.js'

// eslint-disable-next-line max-lines-per-function
describe('.toHaveStyle', () => {
  test('handles positive test cases', () => {
    const { container } = render(`
          <div class="label" style="background-color: blue; height: 100%">
            Hello World
          </div>
        `)

    const style = document.createElement('style')
    style.innerHTML = `
          .label {
            align-items: center;
            background-color: black;
            color: white;
            float: left;
            transition: opacity 0.2s ease-out, top 0.3s cubic-bezier(1.175, 0.885, 0.32, 1.275);
            transform: translateX(0px);
          }
        `
    document.body.appendChild(style)
    document.body.appendChild(container)

    expect(container.querySelector('.label')).toHaveStyle({
      height: '100%',
      color: 'white',
      backgroundColor: 'blue',
    })

    expect(container.querySelector('.label')).toHaveStyle({
      backgroundColor: 'blue',
      color: 'white',
    })

    expect(container.querySelector('.label')).toHaveStyle({
      transition:
        'opacity 0.2s ease-out, top 0.3s cubic-bezier(1.175, 0.885, 0.32, 1.275)',
    })

    expect(container.querySelector('.label')).toHaveStyle({
      backgroundColor: 'blue',
      color: 'white',
    })

    expect(container.querySelector('.label')).not.toHaveStyle({
      color: 'white',
      fontWeight: 'bold',
    })

    expect(container.querySelector('.label')).toHaveStyle({
      alignItems: 'center',
    })

    expect(container.querySelector('.label')).toHaveStyle({
      transform: 'translateX(0px)',
    })
  })

  test('handles negative test cases', () => {
    const { container } = render(`
    <div class="label" style="background-color: blue; height: 100%">
      Hello World
    </div>
  `)

    const style = document.createElement('style')
    style.innerHTML = `
    .label {
      background-color: black;
      color: white;
      float: left;
      transition: opacity 0.2s ease-out, top 0.3s cubic-bezier(1.175, 0.885, 0.32, 1.275);
    }
  `
    document.body.appendChild(style)
    document.body.appendChild(container)

    expect(() =>
      expect(container.querySelector('.label')).toHaveStyle({
        fontWeight: 'bold',
      }),
    ).toThrowError()

    expect(() =>
      expect(container.querySelector('.label')).not.toHaveStyle({
        color: 'white',
      }),
    ).toThrowError()

    expect(() =>
      expect(container.querySelector('.label')).toHaveStyle({
        transition: 'all 0.7s ease, width 1.0s cubic-bezier(3, 4, 5, 6)',
      }),
    ).toThrowError()

    document.body.removeChild(style)
    document.body.removeChild(container)
  })

  test('properly normalizes colors', () => {
    const { queryByTestId } = render(`
      <span data-testid="color-example" style="background-color: #123456">Hello World</span>
    `)
    expect(queryByTestId('color-example')).toHaveStyle({
      'background-color': 'rgb(18, 52, 86)',
    })
  })

  test('only accepts rgb() representation for colors', () => {
    const { queryByTestId } = render(`
      <span data-testid="color-example" style="background-color: #123456">Hello World</span>
    `)
    expect(() => {
      expect(queryByTestId('color-example')).toHaveStyle({
        'background-color': '#123456',
      })
    }).toThrowError()
  })

  test('handles inline custom properties', () => {
    const { queryByTestId } = render(`
      <span data-testid="color-example" style="--color: blue">Hello World</span>
    `)
    expect(queryByTestId('color-example')).toHaveStyle({
      '--color': 'blue',
    })
  })

  test('handles global custom properties', () => {
    const style = document.createElement('style')
    style.innerHTML = `
      div {
        --color: blue;
      }
    `

    const { container } = render(`
      <div>
        Hello world
      </div>
    `)

    document.body.appendChild(style)
    document.body.appendChild(container)

    expect(container).toHaveStyle({ '--color': 'blue' })
  })

  test('properly normalizes colors for border', () => {
    const { queryByTestId } = render(`
    <span data-testid="color-example" style="border: 1px solid #fff">Hello World</span>
  `)
    expect(queryByTestId('color-example')).toHaveStyle({
      border: '1px solid #fff',
    })
  })

  test('handles nonexistent styles', () => {
    const { container } = render(`
          <div class="label" style="background-color: blue; height: 100%">
            Hello World
          </div>
        `)

    expect(container.querySelector('.label')).not.toHaveStyle({
      whatever: 'anything',
    })
  })

  describe('object syntax', () => {
    test('handles styles as object', () => {
      const { container } = render(`
        <div class="label" style="background-color: blue; height: 100%">
          Hello World
        </div>
      `)

      expect(container.querySelector('.label')).toHaveStyle({
        backgroundColor: 'blue',
      })
      expect(container.querySelector('.label')).toHaveStyle({
        backgroundColor: 'blue',
        height: '100%',
      })
      expect(container.querySelector('.label')).not.toHaveStyle({
        backgroundColor: 'red',
        height: '100%',
      })
      expect(container.querySelector('.label')).not.toHaveStyle({
        whatever: 'anything',
      })
    })

    test('does not make assumptions about units', () => {
      const { queryByTestId } = render(`
        <span data-testid="color-example" style="font-size: 12px">Hello World</span>
      `)
      expect(() => {
        expect(queryByTestId('color-example')).toHaveStyle({
          fontSize: '12',
        })
      }).toThrowError()
    })

    test('Fails with an invalid unit', () => {
      const { queryByTestId } = render(`
        <span data-testid="color-example" style="font-size: 12rem">Hello World</span>
      `)
      expect(() => {
        expect(queryByTestId('color-example')).toHaveStyle({ fontSize: '12px' })
      }).toThrowError()
    })

    test('supports dash-cased property names', () => {
      const { container } = render(`
        <div class="label" style="background-color: blue; height: 100%">
          Hello World
        </div>
      `)
      expect(container.querySelector('.label')).toHaveStyle({
        backgroundColor: 'blue',
      })
    })

    test('requires strict empty properties matching', () => {
      const { container } = render(`
        <div class="label" style="width: 100%;height: 100%">
          Hello World
        </div>
      `)
      expect(container.querySelector('.label')).not.toHaveStyle({
        width: '100%',
        height: '',
      })
      expect(container.querySelector('.label')).not.toHaveStyle({
        width: '',
        height: '',
      })
    })
  })
})
