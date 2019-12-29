import { TableEditor } from "../table-editor";
import { Square } from "../square-slides";

const te = new TableEditor({
	ID: "cooltable"
});

const pfs = new Square({
	ID: "coolslides"
});

[
	{ link: "who" },
	{ link: "the" },
	{ link: "quick" },
	{ link: "cwm" },
	{ link: "http://192.168.1.1/images/logo.png" },
	{ link: "vext" },
	{ link: "zephyrs" },
	{ link: "fuckstrum" },
	{ link: "xenofuckstrumifaction" },
	{ link: "xenofuckstrumifaction.parexcellence" }
].forEach(element =>
{
	pfs.DoAdd(element.link);
});

