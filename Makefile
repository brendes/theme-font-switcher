.PHONY: all clean install build package

all: clean install build package

clean:
	rm -rf out/
	rm -rf node_modules/
	rm -f *.vsix

install:
	npm install

build: install
	npm run compile

package: build
	vsce package

install-ext: package
	code --install-extension theme-font-switcher-*.vsix

watch: install
	npm run watch

dev: clean watch