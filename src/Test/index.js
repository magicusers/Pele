import * as d3 from 'd3';


const output = d3.select("#output");

class GameControl extends Aθεος.Αφροδίτη.SharedWorldControl
{
	constructor()
	{
		super({
			ReloadDocumentOnReset: true
		});
	}


	OnInit()
	{

		class MyTable extends Pele.TableEditor
		{
			constructor()
			{
				super(...arguments);

				this.patched_onChange = gameserver.Patch(function ()
				{
					this.original_onChange(...arguments);
				}.bind(this));

				this.patched_addRow = gameserver.Patch(function ()
				{
					this.original_addRow(...arguments);
				}.bind(this));

				this.patched_deleteRow = gameserver.Patch(function ()
				{
					this.original_deleteRow(...arguments);
				}.bind(this));
			}

			onChange()
			{
				if (this.patched_onChange)
					this.patched_onChange(...arguments);
			}
			original_onChange()
			{
				super.onChange(...arguments);
				this.updateDisplay();
			}

			addRow()
			{
				if (this.patched_addRow)
					this.patched_addRow(...arguments);
			}

			original_addRow()
			{
				super.addRow(...arguments);
			}

			deleteRow()
			{
				if (this.patched_deleteRow)
					this.patched_deleteRow(...arguments);
			}

			original_deleteRow()
			{
				super.deleteRow(...arguments);
				this.updateDisplay();
			}

			updateDisplay()
			{
				output.selectAll("span")
					.data(this.get())
					.join(
						enter => enter.append("span")
									.text(d => JSON.stringify(d)),
					update=>update,
					exit=>exit.remove()

					)
					;
			}
		};

		this.dgBanner.Show("Tablula");

		const te = new MyTable({
			ID: "cooltable"
		})


	}
}
window.gameserver = new GameControl();
