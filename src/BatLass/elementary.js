export function removeElement(e)
{
	e.parentElement.removeChild(e);
}

export function extractTemplateElement(id)
{
	const e = document.getElementById(id);
	removeElement(e);
	e.removeAttribute("id", e);

	return e;
}

export function createElementFromHTML(html)
{
	const e = document.createElement("div");
	e.innerHTML = html;
	return e.firstElementChild;
}

export function elementMatches(element, selector)
{

	var p = Element.prototype;
	return (p.matches || p.matchesSelector || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || p.oMatchesSelector).call(element, selector);

}

export function elementClosest(element, selector)
{

	if (window.Element && !Element.prototype.closest)
	{
		var isMatch = elementMatches(element, selector);
		while (!isMatch && element && element !== document)
		{
			element = element.parentNode;
			isMatch = element && element !== document && elementMatches(element, selector);
		}
		return element && element !== document ? element : null;
	}
	else
	{
		return element.closest(selector);
	}

}
