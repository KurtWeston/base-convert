# base-convert

Convert numbers between arbitrary bases (2-62) with custom digit sets and interactive REPL mode

## Features

- Convert numbers between any base from 2 to 62 using digits 0-9, a-z, A-Z
- Support custom character sets for specialized encoding schemes
- Batch conversion mode reading from stdin or files (one number per line)
- Interactive REPL mode for quick conversions with persistent session
- Validate input numbers against source base character set
- Handle large numbers using BigInt for precision
- Display conversion steps for educational purposes (optional flag)
- Support negative numbers with proper sign handling
- Output formatting options (uppercase/lowercase for letter digits)
- Error handling with clear messages for invalid inputs

## How to Use

Use this project when you need to:

- Quickly solve problems related to base-convert
- Integrate typescript functionality into your workflow
- Learn how typescript handles common patterns

## Installation

```bash
# Clone the repository
git clone https://github.com/KurtWeston/base-convert.git
cd base-convert

# Install dependencies
npm install
```

## Usage

```bash
npm start
```

## Built With

- typescript

## Dependencies

- `commander`
- `chalk`
- `readline`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
