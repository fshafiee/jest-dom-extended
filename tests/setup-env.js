import '../src/extend-expect.js'
import ansiEscapesSerializer from 'jest-serializer-ansi-escapes'

expect.addSnapshotSerializer(ansiEscapesSerializer)
