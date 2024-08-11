// gulpfile.mjs

import { join } from 'path'
import gulp from 'gulp'
import gulpESLintNew from 'gulp-eslint-new'

import * as url from 'url'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

// The lint task
const lint = () =>
   gulp
      .src(['scripts/*.js', '!node_modules/**'])
      .pipe(gulpESLintNew({ cwd: join(__dirname, '') }))
      .pipe(gulpESLintNew.formatEach())

// The watch task
const watch = () => gulp.watch('scripts/*.js').on('change', gulp.series(lint))

export { lint, watch as default }
