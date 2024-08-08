import globals from 'globals'
import pluginJs from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin-js'

export default [
   // Wstępnie zdefiniowane zmienne globalne dla przeglądarki
   { languageOptions: { globals: globals.browser } },

   // ESLint ma dwie predefiniowane konfiguracje dla JavaScript:
   // pluginJs.configs.recommended - włącza reguły, których ESLint zaleca wszystkim użytkownikom, aby uniknąć potencjalnych błędów
   // pluginJs.configs.all - włącza wszystkie reguły dostarczane z ESLint
   pluginJs.configs.recommended,

   {
      plugins: {
         // Reguły stylistyczne JavaScript dla ESLint, przeniesione z core eslint
         '@stylistic/js': stylisticJs,
      },
      rules: {
         // Włącza dodatkowe reguły

         // Aby zmienić poziom ważności reguły, ustaw identyfikator reguły na jedną z poniższych wartości:
         // "off" lub 0 - wyłącz regułę
         // "warn" lub 1 - włącz regułę jako ostrzeżenie
         // "error" lub 2 - włącz regułę jako błąd

         // Lista reguł: https://eslint.org/docs/latest/rules/

         // Wymuszaj return w wywołaniach zwrotnych metod tablicowych np. filter, find, map, reduce itd
         'array-callback-return': 'error',

         // Nie wymuszaj stosowania nawiasów klamrowych tam, gdzie można je pominąć w funkcjach strzałkowych
         'arrow-body-style': ['error', 'as-needed'],

         // Wymagaj === i !== w porównaniach
         eqeqeq: ['error', 'always'],

         // Zmienne muszą zostać zainicjowane podczas deklaracji
         'init-declarations': ['error', 'always'],

         // Nie zezwalaj na niepotrzebne zagnieżdżone bloki { }
         'no-lone-blocks': 'error',

         // Nie zezwalaj na ponowne przypisywanie parametrów funkcji
         'no-param-reassign': 'error',

         // Celem tej reguły jest oznaczanie zmiennych, które zostały zadeklarowane przy użyciu let, ale nigdy nie zostały ponownie przypisane po początkowym przypisaniu.
         'prefer-const': [
            'error',
            {
               destructuring: 'any',
               ignoreReadBeforeAssign: false,
            },
         ],

         // Wymagaj destrukturyzacji tablic i obiektów
         'prefer-destructuring': ['error', { object: true, array: false }],

         // Warning jeśli zostały jakieś console.log w kodzie
         'no-console': 'warn',

         // STYLIZACJA

         // Nie używaj średników
         '@stylistic/js/semi': ['error', 'never'],

         // W stylu bez średników średniki znajdują się na początku wierszy tu gdzie są wymagane. Ta reguła wymusza, aby średniki znajdowały się na końcu.
         '@stylistic/js/semi-style': ['error', 'last'],

         // Styl komentarzy
         '@stylistic/js/spaced-comment': [
            'error',
            'always',
            {
               line: {
                  markers: ['/'],
                  exceptions: ['-', '+'],
               },
               block: {
                  markers: ['!'],
                  exceptions: ['*'],
                  balanced: true,
               },
            },
         ],

         // Nie zezwalaj na zbędne nawiasy
         '@stylistic/js/no-extra-parens': 'error',

         // Ciągi w pojedyńczych apostrofach
         '@stylistic/js/quotes': ['error', 'single'],

         // Pozwalaj na pominięcie nawiasów, gdy istnieje tylko jeden argument w funkcjach strzałkowych
         '@stylistic/js/arrow-parens': ['error', 'as-needed'],
      },
   },
]
