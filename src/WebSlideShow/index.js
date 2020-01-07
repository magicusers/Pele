import './index.scss'

import * as _ from 'lodash';


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

		class MySlides extends Pele.SquareSlides
		{
			constructor(options)
			{
				super(options);

				this.patched_Action = gameserver.Patch(function ()
				{
					this.original_Action(...arguments);
				}.bind(this));

				const myself = document.getElementById(options.ID);

			}

			Action()
			{
				if (this.patched_Action)
					this.patched_Action(...arguments);
			}
			original_Action()
			{
				super.Action(...arguments);
			}
		};

		this.dgBanner.Show("Webshow");

		const pfs = new MySlides({
			ID: "coolslides"
		});
		
		/*
		[
			{ link: "who" },
			{ link: "https://lordredblue.github.io/orgoShmorgo/" },
			{ link: "quick" },
			{ link: "cwm" },
			{ link: "http://192.168.1.1/images/logo.png" },
			{ link: "vext" },
			{ link: "fuckstrum" },
			{ link: "xenofuckstrumifaction" },
			{ link: "zephyrs" },
			{ link: "xenofuckstrumifaction.parexcellence" }
		].forEach(element =>
		{
			pfs.DoAdd(element.link);
		});
		*/
		
		
		window.DoNext = () => pfs.DoNext();
		window.DoPrevious = () => pfs.DoPrevious();
		window.DoSome = () => pfs.DoSome();
		window.DoDelete = () => pfs.DoDelete();
		
		document.addEventListener("paste", event =>
		{
			let data = (event.clipboardData || window.clipboardData).getData('text');
			if (data)
			{
				console.debug("pasty", data);
		
				pfs.DoAdd(data);
		
				event.preventDefault();
				event.stopPropagation();
			}
		});


	}
}
window.gameserver = new GameControl();
