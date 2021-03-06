export class TableEditor
{
	constructor(options)
	{
		console.debug(options);

		this.eTable = document.getElementById(options.ID);

		this.$body = this.eTable.querySelector("tbody");
		const rowtemplate = this.$body.querySelector("tr:last-child");
		this.$template = rowtemplate.cloneNode(true);
		this.$lastRemoveRow = undefined;

		this.defaultValues = serializeRow(this.$template);
		this.recordsCount = 0;

		connectedCallback.call(this);
		setupDragHandlers.call(this, rowtemplate);
	}

	get()
	{
		return Array.prototype.slice
			.call(this.$body.children, 0, -1)
			.map(serializeRow);
	}

	onChange(cell)
	{
		//console.debug("change", cell);
		this.DoChange(cell);
	}

	DoChange(cell)
	{

		const eRow = this.$body.children[cell[0]];
		const eCell = eRow.cells[cell[1]];

		eCell.querySelector('[name]').value = cell[2];
		console.debug("DoChange", cell, eCell);
	}

	handleChange(event)
	{
		this.onChange(this.getCellData(event.target));
		if (event.target.matches("select,input[type=checkbox],input[type=radio]"))
		{
			this.handleInput(event);
			return;
		}
	}

	moveRow(from, to)
	{
		const eFrom = this.$body.children[from];
		const eTo = this.$body.children[to];

		if (eFrom && eTo)
			this.$body.insertBefore(eFrom, eTo);
	}

	getCellData(target)
	{
		const eCell = target.closest("td");
		const eRow = eCell.closest("tr");

		const indexRow = [...eRow.parentNode.children].indexOf(eRow);

		return [indexRow, eCell.cellIndex, target.value];
	}

	/**
	 * Handle `input` events as well as `change` events of <select>s and other
	 * tags which do not support `input`.
	 *
	 * @param {EditableTable} editableTable
	 * @param {Event} event
	 */
	handleInput(event)
	{
		const $input = event.target;
		const $row = $input.closest("tr");
		const index = [...$row.parentNode.children].indexOf($row);
		const record = serializeRow($row);
		const isNew = index + 1 > this.recordsCount;
		const changeType = isNew ? "add" : "update";

		if (changeType === "update")
		{
			record[$input.getAttribute("name")] = $input.value;
		}

		if (changeType === "add")
		{
			this.recordsCount += +1;
			createRecordsAbove(this, index);
		}

	}



	/**
	 * add a new row when focus is set in the last one. That makes
	 * the table grow automatically, no need for extra buttons.
	 *
	 * @param {EditableTable} editableTable
	 * @param {object} record
	 * @param {object} options
	 */
	addRow()
	{
		const $row = this.$template.cloneNode(true);


		const $lastRow = this.$body.querySelector("tr:last-child");

		if (isEmptyRow(this, $lastRow))
			return $lastRow;

		setupDragHandlers.call(this, $row);

		return this.$body.appendChild($row);
	}

	deleteRow(index)
	{
		var $row = this.$body.children[index];
		this.$body.removeChild($row);

		this.recordsCount--;

		removeEmptyRows(this);
	}
};

function rowIndex(row)
{
	return [...row.parentNode.children].indexOf(row);
}

function setupDragHandlers(row)
{
	const self = this;
	const DRAGON_DROP_MIME_TYPE = "application/x-pele-move-row";
	if (row.getAttribute("draggable"))
	{
		const eTable = this.eTable;

		row.addEventListener("dragstart", function (event)
		{
			//console.debug("dragstart", event.target);
			
			if (isEmptyRow(self, row))
				event.preventDefault();
			else
			{
				eTable.classList.add("pele_dragover");
				event.dataTransfer.effectAllowed="move";
				event.dataTransfer.setData(DRAGON_DROP_MIME_TYPE, rowIndex(row));
			}
		});

		row.addEventListener("dragover", function (event)
		{
			if (event.dataTransfer.types.includes(DRAGON_DROP_MIME_TYPE))
			{
				row.classList.add("pele_dragover");
				event.preventDefault();
			}
		});
		row.addEventListener("dragenter", function (event)
		{
			//row.classList.add("pele_dragover");
			//event.preventDefault();
		});
		row.addEventListener("dragleave", function (event)
		{
			row.classList.remove("pele_dragover");
			//event.preventDefault();
		});


		row.addEventListener("drop", function (event)
		{
			row.classList.remove("pele_dragover");
			eTable.classList.remove("pele_dragover");

			const originalrow = event.dataTransfer.getData(DRAGON_DROP_MIME_TYPE);
			if (originalrow !== undefined)
			{
				const row_index = rowIndex(row);
				if (originalrow != row_index)
				{
					console.debug("move successufl", originalrow, row_index);
					self.moveRow(originalrow, row_index);
				}
				event.preventDefault();
			}
		});

		row.addEventListener("dragend", function (event)
		{
			eTable.classList.remove("pele_dragover");
			event.preventDefault();
		});

	}

}

function connectedCallback()
{
	const body = this.$body;

	body.addEventListener("focus", event => handleFocus(this, event), {
		capture: true,
		passive: true
	});
	body.addEventListener("blur", event => handleBlur(this, event), {
		capture: true,
		passive: true
	});
	body.addEventListener("click", event => handleClick(this, event), {
		capture: true,
		passive: true
	});
	body.addEventListener("input", event => this.handleInput(event), {
		capture: true,
		passive: true
	});
	body.addEventListener("change", event => this.handleChange(event), {
		capture: true,
		passive: true
	});
}



/**
 * Set the current raw to "active" and add a new row if it's the last one.
 *
 * @param {EditableTable} editableTable
 * @param {Event} event
 */
function handleFocus(editableTable, event)
{
	const $row = event.target.closest("tr");
	if ($row.matches("tr:last-child"))
	{
		editableTable.addRow();
	}

	$row.classList.add("active");
	removeEmptyRows(editableTable, $row);

	// Stop the timout started in `handleBlur`
	clearTimeout(editableTable.removeTimeout);
}

/**
 * on blur, empty rows get removed from the end of the table after a timeout.
 *
 * @param {EditableTable} editableTable
 * @param {Event} event
 */
function handleBlur(editableTable, event)
{
	event.target.closest("tr").classList.remove("active");

	editableTable.removeTimeout = setTimeout(
		() => removeEmptyRows(editableTable),
		100
	);
}

/**
 * If the remove button is pressed, remove the current row and all empty rows at the end.
 * Otherwise find the closest input and focus it.
 *
 * @param {EditableTable} editableTable
 * @param {Event} event
 */
function handleClick(editableTable, event)
{
	if (event.target.matches("[name]"))
	{
		return;
	}

	if (event.target.matches("[data-remove]"))
	{
		const cell = editableTable.getCellData(event.target);
		editableTable.deleteRow(cell[0]);
		return;
	}

	event.target.querySelector("[name]").focus();
}

/**
 * Forward event to `handleInput` for tags that do not support the `input` event.
 *
 * @param {EditableTable} editableTable
 * @param {Event} event
 */

// HELPER METHODS


/**
 * A row is considered empty when its values match
 * the template's values
 *
 * @param {EditableTable} editableTable
 * @param {HTMLTableRowElement} $row
 */
function isEmptyRow(editableTable, $row)
{
	var record = serializeRow($row);

	for (const [property, defaultValue] of Object.entries(
		editableTable.defaultValues
	))
	{
		if (defaultValue !== record[property])
		{
			return false;
		}
	}

	return true;
}

/**
 * turns a row into an object
 *
 * @param {HTMLTableRowElement} $row
 */
function serializeRow($row)
{
	var record = {};
	for (const $input of $row.querySelectorAll("[name]"))
	{
		record[$input.getAttribute("name")] = $input.value.trim();
	}

	return record;
}

/**
 * removes all rows that are empty above the last row (the template row).
 * Optionally the current row can be passed to prevent it from being removed.
 *
 * @param {EditableTable} editableTable
 * @param {HTMLTableRowElement} $currentRow
 */
function removeEmptyRows(editableTable, $currentRow)
{
	const $lastRow = editableTable.$body.querySelector("tr:last-child");
	let $prev = $lastRow.previousElementSibling;
	let index = editableTable.$body.children.length - 2;

	while ($prev && $prev !== $currentRow && isEmptyRow(editableTable, $prev))
	{
		editableTable.$body.removeChild($prev);

		if (index <= editableTable.recordsCount)
		{
		}

		$prev = $lastRow.previousElementSibling;
		index--;
		editableTable.recordsCount--;
	}
}

/**
 * assure that all rows above the current row have existing records.
 *
 * @param {EditableTable} editableTable
 * @param {HTMLTableRowElement} $row
 */
function createRecordsAbove(editableTable, index)
{
	const $rows = editableTable.$body.children;
	const newRecordsCount = index + 1;

	for (
		;
		editableTable.recordsCount < newRecordsCount;
		editableTable.recordsCount++
	)
	{
		index = editableTable.recordsCount - 1;
		const record = serializeRow($rows[index]);
	}
}

