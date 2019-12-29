import * as d3 from 'd3';
import * as _ from 'lodash';

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
		let idForOutput=0;

		class MyTable extends Pele.TableEditor
		{
			constructor(options)
			{
				super(options);

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

				this.patched_moveRow = gameserver.Patch(function ()
				{
					this.original_moveRow(...arguments);
				}.bind(this));

				this.fShowLinear = true;
				output.on("click", gameserver.Patch(function ()
				{
					this.fShowLinear = !this.fShowLinear;
					this.updateDisplay();
				}.bind(this))
				);

				const myself = document.getElementById(options.ID);
				const myparent = myself.parentElement;

				output.on("dblclick", gameserver.Patch(function ()
				{
					//myself.style.display = (getComputedStyle(myself).display !== "none")?"none":"block";
					if (myself.parentElement)
						myparent.removeChild(myself);
					else
						myparent.appendChild(myself);
				}.bind(this))
				);

				myself.addEventListener("drop", function (event)
				{
					console.debug("input drop", event);
					const data = event.dataTransfer.getData("text/uri-list");
					if (data !== undefined)
					{
						console.debug("url", data);
						
						if(event.target.getAttribute("name") == "category")
						{
							event.target.value = data;
							event.target.dispatchEvent(new Event("change"));
						}

						event.preventDefault();
						event.stopPropagation();
					}
				});


				this.updateDisplay = _.debounce(() => {this.updateDisplayActual()}, 50, {leading:true,trailing:true} );
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

			moveRow()
			{
				if (this.patched_moveRow)
					this.patched_moveRow(...arguments);
			}

			original_moveRow()
			{
				super.moveRow(...arguments);
				this.updateDisplay();
			}

			updateDisplayActual()
			{
				const patched_click = gameserver.Patch(function (id){
					output.selectAll("[data-uniqueid]").classed("selected_for_highlight",false);
					output.selectAll("[data-uniqueid='"+id + "']")
						.classed("selected_for_highlight",true);
				});

				const data = this.get();

				const maxval = data.reduce((max, v) => Math.max(v.size, max), 0);

				const fShowLinear = this.fShowLinear;
				//console.debug(data);
				output.selectAll("div")
					.data(data)
					.join(
						enter => enter.append("div")
							.style("background-color", d => d.color)
							.style("width", d => (fShowLinear ? (100 * d.size / maxval):(100 * Math.log(d.size) / Math.log(maxval))) + "%")
							.text(d => d.category)
							.attr("data-uniqueid", ()=> ++idForOutput)
							.on('click', function(event){
								patched_click(d3.select(this).attr("data-uniqueid"));
								d3.event.stopPropagation();
							})
						, update => update.transition()
							.text(d => d.category)
							.style("background-color", d => d.color)
							.style("width", d => (fShowLinear ? (100 * d.size / maxval):(100 * Math.log(d.size) / Math.log(maxval))) + "%")
						, exit => exit.transition().remove()

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
