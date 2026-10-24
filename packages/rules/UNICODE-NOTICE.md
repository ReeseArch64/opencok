# Unicode collation data

`src/mysql-unicode-weights.ts` contains primary collation data derived from
[Unicode UCA 4.0.0 allkeys](https://www.unicode.org/Public/UCA/4.0.0/allkeys-4.0.0.txt).
The associated copyright and permission notice is in [UNICODE-LICENSE.txt](UNICODE-LICENSE.txt).
The downloaded source SHA-256 is
`e97345da79baf2ab6a72304fe84732b5d0c4b4c6adc888679fd17a6a546ec195`.
No private game data supplies these weights.

The table retains single-code-point BMP records, extracts nonzero primary weights
from all collation elements and omits U+FDFA to preserve its implicit weight in the
reference MySQL collation. Multi-code-point contraction records are excluded. The
result contains 12,072 explicit characters in 3,963 ordered runs. Each run stores
`[first, last, increment, ...weights]`; the increment applies only to the final
weight as the input code point advances from `first`. Empty weight lists identify
primary-ignorable characters. Runs combine adjacent entries only when their weight
prefixes and lengths agree and the last weight is constant or increases by one.
All omitted characters use the historical implicit-weight formula. No contemporary
normalization, language tailoring or runtime ICU data participates.

The independent comparison reference was the public default UCA 4 tables in
[MySQL 5.7 ctype-uca.c](https://github.com/mysql/mysql-server/blob/f7680e98b6bbe3500399fbad465d08a6b75d7a5c/strings/ctype-uca.c).
An offline parser read the `uca_length`, `pageXXXdata` and default page-pointer
tables, using the documented implicit weights for absent pages. The unpadded
primary-weight sequences for all 65,536 code units, represented as lowercase
four-digit hexadecimal weights and joined with LF without a final LF, have SHA-256
`6b26dbb1b79480aee847ff34e7dff0f1287a111aaf37cf2bd2d92b90519dad25`.
These sequences agree with the Unicode-derived table after the U+FDFA exception.
The runtime implementation is independently written TypeScript; no MySQL program
or database was executed, and no MySQL implementation code is included.

The unit checksum excludes surrogate code units and removes trailing U+0020
primary weights (`0209`) for SQL PAD SPACE equality. Each record is
`codePointHex:concatenatedWeightHex`, again joined by LF without a final LF.
The 63,488 records have SHA-256
`5b4f2a62764df55c6d214ecdcd96cfff64f921ef621759690c371643ec11209e`.
Separate synthetic units cover expansions, primary ignorables, padding, historical
exceptions and invalid inputs. Normal tests have no network or external runtime
dependency. The equality key is not a SQL ordering key and must be computed from
the complete value: trimming trailing weights makes concatenated component keys
unsuitable for comparing concatenated text.
