"use strict";

const debug = require("debug")("fontlist");

interface FontSize {
	width: number;
	height: number;
}

interface Fonts {
	[key: string]: FontSize;
}

export enum FontType {
	all,
	fixed,
	variable
}

export const fonts: any = require("./fontlist.json");
export const fontVariable: string[] = fonts["variable"];
export const fontFixed: string[] = fonts["fixed"];

export class Detector {
	private baseFonts: Fonts = {
		monospace: {
			width: 0,
			height: 0
		},
		"sans-serif": {
			width: 0,
			height: 0
		},
		serif: {
			width: 0,
			height: 0
		}
	};

	private body: any;
	private span: any;

	// Use m or w because these two characters take up the maximum width.
	// And use LLi so that the same matching fonts can get separated
	private readonly testString: string = "mmmmmmmmmmlli";
	private readonly testSize: string = "72px";

	constructor() {
		this.body = document.getElementsByTagName("body")[0];
		this.span = document.createElement("span");

		this.span.style.fontSize = this.testSize;
		this.span.innerHTML = this.testString;

		for (const key of Object.keys(this.baseFonts)) {
			this.span.style.fontFamily = key;

			this.body.appendChild(this.span);
			this.baseFonts[key].width = this.span.offsetWidth;
			this.baseFonts[key].height = this.span.offsetHeight;
			this.body.removeChild(this.span);
		}
	}

	/**
	 * Adds the requested font to the document body.  It checks to see if the
	 * width or height of the testString has changed when compared to the
	 * computed baseFonts.  If there is a change, then detect returns
	 * true.  If all baseFonts are checked and there is no change, then the
	 * font is not available.
	 * @param fontName {string} the name of the font to check in the browser
	 * @return true if the font is available, otherwise false.
	 */
	public detect(fontName: string) {
		for (const key of Object.keys(this.baseFonts)) {
			this.span.style.fontFamily = `${fontName},${key}`;
			this.body.appendChild(this.span);

			const matched: boolean =
				this.span.offsetWidth !== this.baseFonts[key].width ||
				this.span.offsetHeight !== this.baseFonts[key].height;
			this.body.removeChild(this.span);
			if (matched) {
				debug("%s is available", fontName);
				return true;
			}
		}

		debug("%s is NOT available", fontName);
		return false;
	}
}

/**
 * A convenience function that checks a base list of possible fonts and returns
 * the list that was found.  It uses the file "fontlist.json" to list the fonts
 * that will be used by default.  Expand this list to expand default lookup coverage.
 * The caller can also pass a list of fonts and override the default "fontlist.json"
 * @param fontList {string[]} a custom list of fonts that will be used for the
 * search list.  If empty the "fontlist.json" will be used.
 * @param fontType {FontType} two types of fonts: fixed and variable.  By default
 * all types will be searched.  This allows the caller to segregate types if
 * desired.
 * @return {string[]} an array of strings containing valid fonts.
 */
export function getFontList(
	fontList: string[] = [],
	fontType: FontType = FontType.all
): string[] {
	const l: string[] = [];
	const detector = new Detector();

	if (fontList.length === 0) {
		switch (fontType) {
			case FontType.fixed:
				fontList = fontFixed;
				break;

			case FontType.variable:
				fontList = fontVariable;
				break;

			case FontType.all:
			default:
				fontList = fontList.concat(fontFixed, fontVariable);
				break;
		}
	}

	debug("list of possible fonts: %O", fontList);
	for (const fontName of fontList) {
		if (detector.detect(fontName)) {
			l.push(fontName);
		}
	}

	return l;
}
