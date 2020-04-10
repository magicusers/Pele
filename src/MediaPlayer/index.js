
import videojs from 'video.js';
import 'videojs-youtube';

import './index.scss';


import { KookData } from "../BatLass/KookData";
import _ from 'lodash';

class GameControl extends Aθεος.Αφροδίτη.SharedContainerWorld
{
	constructor()
	{
		super({
			Title: "Media Player"
			, ReloadDocumentOnReset: true
			, Container: document.getElementById("idMagicUsersContainer")
			, Server:
			{
				//MessageProcessingPaused:true
			}
		});

		const server = this.Server;

		document.body.addEventListener("drop", function (event)
		{
			console.debug("input drop", event);
			const data = event.dataTransfer.getData("text/uri-list");
			if (data !== undefined)
			{
				console.debug("url", data);
				changeURL(data);

				event.preventDefault();
				event.stopPropagation();
			}
		});

		document.body.addEventListener("dragover", function (event)
		{
			event.preventDefault();
		});

		class MyPlayer extends videojs.getComponent('Player')
		{
			constructor()
			{
				super(...arguments);

				this.patched_play = server.Patch(() =>
				{
					console.debug("replay play");

					super.play();
				});
				this.patched_pause = server.Patch(() =>
				{
					console.debug("replay pause");
					super.pause();
				});

				const debounced_setTime = _.debounce((timestamp) => super.currentTime(timestamp), 1000);

				this.patched_setTime = server.PatchRaw((env, timestamp) =>
				{
					console.debug("replay setTime", timestamp);

					if (env.inplaybackmode)
						debounced_setTime(timestamp);
					else
						super.currentTime(timestamp);
				});

			}

			play()
			{
				console.debug("MyPlayer play", ...arguments);
				this.patched_play();
			}

			pause()
			{
				console.debug("MyPlayer pause", ...arguments);
				this.patched_pause();
			}

			currentTime(timestamp)
			{
				if (timestamp)
				{
					console.debug("MyPlayer currentTime", timestamp);
					this.patched_setTime(timestamp);
				}
				else
					return super.currentTime();
			}
		};


		const divMediaContainer = document.getElementById("idMediaContainer");

		var changeURL = server.Patch((url) =>
		{
			if (this.player)
				this.player.dispose();

			const newvideo = document.createElement("video");
			newvideo.className="video-js vjs-default-skin";
			divMediaContainer.appendChild(newvideo);

			this.player = videojs(newvideo, {
					"techOrder": ["youtube"],
					controls:true,
					autoplay:false,
					sources: {
						type: "video/youtube",
						src: url
					}
				}, function ()
				{
					console.debug("loaded video");

					//setTimeout(()=>server.ResumeMessageProcessing(), 1000);

					this.on("playing", function ()
					{
						console.debug("Am a playing");
						Aθεος.Freyja.QueryParent("Mediaplayer.Control.Directive", "playing");
					});
					this.on("pause", function ()
					{
						console.debug("paussy catz");
						Aθεος.Freyja.QueryParent("Mediaplayer.Control.Directive", "pause");
					});
					this.on("timeupdate", function ()
					{
						//console.debug("tick", this.currentTime());
					});

				});
		});

		videojs.registerComponent("Player", MyPlayer);

	}


	OnInit()
	{
		super.OnInit();
	}
}

Aθεος.Αφροδίτη.OnReady().then(() => new GameControl());

