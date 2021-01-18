# vfm-viewer

Experimental real-time typesetting previewer for [VFM](https://github.com/vivliostyle/vfm).

## Usage

See [example](https://github.com/Monchi/vfm-viewer/tree/master/example).

```bash
$ vfm-viewer preview --help
vfm-viewer preview [file]

Preview typesetting result

Options:
      --version  Show version number                                   [boolean]
  -c, --config   Path to config file [string] [default: "vivliostyle.config.js"]
  -h, --help     Show help                                             [boolean]
  -p, --port                                            [number] [default: 3000]

```

## Configuration

vfm-viewer supports some properties of `vivliostyle.config.js`.

### theme

Only local `.css` file is supported. Local directory and NPM package are not supported.

```json
theme: "./example.md"
```

### size

Presets are not supported yet.

```json
size: "960px,720px"
```
