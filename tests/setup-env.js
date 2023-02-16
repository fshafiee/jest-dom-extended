import { plugins } from 'pretty-format'
import '../src/extend-expect.js'

expect.addSnapshotSerializer(plugins.ConvertAnsi)
