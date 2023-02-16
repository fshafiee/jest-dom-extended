/* eslint-disable @typescript-eslint/no-explicit-any */

interface CustomMatchers<R> {
  toBeChecked(): R;

  toBeDisabled(): R;

  toBeEnabled(): R;

  toBeEmptyDOMElement(): R;

  toBeInTheDocument(): R;

  toBeInvalid(): R;

  toBeValid(): R;

  toBePartiallyChecked(): R;

  toBeRequired(): R;

  toBeVisible(): R;

  toContainElement(element: Element): R;

  toContainHTML(htmlText: string): R;

  toHaveAccessibleDescription(expectedAccessibleDescription?: string | RegExp);

  toHaveAccessibleName(expectedAccessibleDescription?: string | RegExp);

  toHaveAttribute(name?: string, expectedValue?: string);

  toHaveClass(
    expectedClassNames?: string | string[],
    options?: {
      exact: boolean;
    }
  );

  toHaveDisplayValue(
    expectedValue: string | number | RegExp | (string | number | RegExp)[]
  );

  toHaveErrorMessage(expectedMessage?: string | RegExp);

  toHaveFocus();

  toHaveFormValues(
    expectedValues: Record<
      string,
      string,
      string | number | string[] | number[]
    >
  );

  toHaveStyle(
    css: Partial<CSSStyleDeclaration> | Record<string, number | string> | string
  );

  toHaveTextContent(
    checkWith: string | number | RegExp,
    options?: { normalizeWhitespace: boolean }
  );

  toHaveValue(expectedValue?: null | string | number | (string | number)[]);
}

declare namespace jest {
  // noinspection JSUnusedGlobalSymbols
  interface Matchers<R> {
    toBeChecked(): R;

    toBeDisabled(): R;

    toBeEnabled(): R;

    toBeEmptyDOMElement(): R;

    toBeInTheDocument(): R;

    toBeInvalid(): R;

    toBeValid(): R;

    toBePartiallyChecked(): R;

    toBeRequired(): R;

    toBeVisible(): R;

    toContainElement(element: Element): R;

    toContainHTML(htmlText: string): R;

    toHaveAccessibleDescription(
      expectedAccessibleDescription?: string | RegExp
    );

    toHaveAccessibleName(expectedAccessibleDescription?: string | RegExp);

    toHaveAttribute(name?: string, expectedValue?: string);

    toHaveClass(
      expectedClassNames?: string | string[],
      options?: {
        exact: boolean;
      }
    );

    toHaveDisplayValue(
      expectedValue: string | number | RegExp | (string | number | RegExp)[]
    );

    toHaveErrorMessage(expectedMessage?: string | RegExp);

    toHaveFocus();

    toHaveFormValues(
      expectedValues: Record<
        string,
        string,
        string | number | string[] | number[]
      >
    );

    toHaveStyle(
      css:
        | Partial<CSSStyleDeclaration>
        | Record<string, number | string>
        | string
    );

    toHaveTextContent(
      checkWith: string | number | RegExp,
      options?: { normalizeWhitespace: boolean }
    );

    toHaveValue(expectedValue?: null | string | number | (string | number)[]);
  }

  interface Expect extends CustomMatchers<any> {}

  interface InverseAsymmetricMatchers extends Expect {}
}
