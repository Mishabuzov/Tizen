var backEventListener = null;

var unregister = function() {
	if (backEventListener !== null) {
		document.removeEventListener('tizenhwkey', backEventListener);
		backEventListener = null;
		window.tizen.application.getCurrentApplication().exit();
	}
}

// Initialize function
var init = function() {
	// register once
	if (backEventListener !== null) {
		return;
	}

	// TODO:: Do your initialization job
	console.log("init() called");

	var backEvent = function(e) {
		if (e.keyName == "back") {
			try {
				if ($.mobile.urlHistory.activeIndex <= 0) {
					// if first page, terminate app
					unregister();
				} else {
					// move previous page
					$.mobile.urlHistory.activeIndex -= 1;
					$.mobile.urlHistory.clearForward();
					window.history.back();
				}
			} catch (ex) {
				unregister();
			}
		}
	}
	$('#btnNewGame').bind('click', function() {
		initTeamChoosingScreen();
	})

	$('#btnRules').bind('click', function() {
		console.log("rules");
	})
	document.addEventListener('tizenhwkey', backEvent);
	backEventListener = backEvent;
};

function initFirstPage() {
	$(document).bind("pageinit", function() {

		$('#btnNewGame').bind('click', function() {
			initTeamChoosingScreen();
		});

		$('#btnRules').bind('click', function() {
			console.log("rules");
		});
		location.reload();
	});
}

var score = 0;

// Выбранные юзером на предыдущем экране команды.
var team = {
	id : 1,
	name : "Команда 1",
	score : 0
};

var team2 = {
	id : 2,
	name : "Команда 2",
	score : 0
};

var team3 = {
	id : 3,
	name : "Злобные хорьки",
	score : 0
};

var teams = [ team, team2 ];

var dictionary = [ "соревнование", "лес", "обучение", "колыбель", "идеал",
		"пилот", "тактика", "боксёр", "рюмка", "удочка", "сцепление", "таджик",
		"заряд", "часовня", "текила", "хранитель", "федерация", "ранец",
		"селёдка", "доктор", "фант", "комфорт", "мороз", "бремя", "капитан",
		"расстояние", "врата", "ввоз", "беда", "хаос", "яблокорезка", "швабра",
		"кустарник", "холостяк", "паутина", "столовая", "клиника", "тир",
		"командир", "пиво", "сито", "укладка", "каравай", "фарш", "вор",
		"влага", "щит", "исповедь", "сиделка", "полотенце", "кот", "каникулы",
		"современник", "отличница", "гадюка", "серия", "газон", "код",
		"перелом", "блузка", "крыса", "дыня", "сайт", "офис", "клубника",
		"котлета", "парень", "линолеум", "евро", "поезд", "шкура", "общество",
		"направление", "нападающий", "надежда", "початок", "пробел",
		"исследование", "процент", "обед", "купюра", "рельса", "запах", "шеф",
		"противогаз", "грива", "пух", "арест", "камень", "боец", "плащ",
		"фура", "обливание", "злак", "ветка", "зола", "утка", "создание",
		"мусульманка", "канава", "кондуктор", "призыв", "мама", "пари",
		"жесть", "принтер", "баллон", "бусы", "сноска", "орган", "идея",
		"мизинец", "сусек", "мат", "комплимент", "кадр", "рабство", "сын",
		"монах", "пудра", "хрусталик", "воин", "гречка", "занавес", "каска",
		"природа", "консультация", "рысца", "мультиварка", "калькулятор",
		"строка", "мушкетёр", "солнце", "бисер", "сарай", "подоконник",
		"любовь", "знак", "заяц", "свекровь", "фестиваль", "нищета", "кафель",
		"скафандр", "пуск", "фехтовальщик", "ширинка", "босс", "устав",
		"вакцинация", "теплота", "шкала", "цапля", "бюст", "болельщик",
		"дикарь", "сплав", "тире", "вегетарианство", "бедность", "вода",
		"мельница", "тренировка", "экран", "срам", "лекарство", "одуванчик",
		"дно", "шампур", "юморист", "статуэтка", "обжорство", "баня", "башня",
		"покрой", "гараж", "конфетти", "литр", "ром", "пучок" ];

var hardDictionary = [ "дисперсия", "гидростанция", "любезность", "цеховщина",
		"казуистика", "коленкор", "аннексия", "гироскоп", "флюорит", "турнюр",
		"картуз", "радетель", "стяжательство", "фисгармония", "междуусобица",
		"радиолокатор", "гуидак", "терракота", "концертмейстер", "навет",
		"пердимонокль", "вольфрам", "атрофия", "каланча", "оглобля",
		"землепашество", "бренность", "воздухоплаватель", "цвергшнауцер",
		"ментор", "магнолия", "благоденствие", "тарабарщина", "волочайка",
		"опоссум", "уроборос", "беспутство", "нелепица", "перебежчик",
		"эмульгатор", "мисофония", "закладчик", "парламентарий", "монпансье",
		"панегирик", "плутоний", "памфлет", "паноптикум", "алебарда", "изувер",
		"эвристика", "субъективист", "разведенец", "эпициклоида",
		"многозадачность", "компрачикос", "сомнамбулизм", "буффонада",
		"главенство", "мытарство", "глаукома", "оснащённость",
		"взаимообусловленность", "вольнодумство", "бульварщина", "погибель",
		"бричка", "багор", "излишек", "озонатор", "инцидент", "урбанизация",
		"додекаэдр", "стелла", "истома", "фанфаронство", "метрология",
		"прилипала", "басма", "автохтонность", "батрачество", "воднолыжник",
		"противозакручиватель", "конкордация", "скряжничество", "молельня",
		"ноктюрн", "лицедей", "здравница", "юдофобия", "табельщик",
		"женоненавистник", "карабинер", "бенуар", "эквилибристика",
		"амфибрахий", "ведение", "коляда", "серсо", "богема", "акселерат",
		"форсунка", "мракобес", "эмиссия", "аберрация", "поварёнок", "калиф",
		"готовальня", "штакетина", "вероотступничество", "силлогизм",
		"беллетрист", "помазание", "евнух", "корнишон", "люфт", "феодализм",
		"барельеф", "головотяп", "чапельник", "понтон", "сдельщина",
		"софистика", "углекислота", "естествоиспытатель", "вещмешок",
		"отдаление", "возвышение", "коммивояжер", "гиббон", "архивист",
		"ординар", "редукция", "расстегай", "вакханалия", "канцелярист",
		"эскулап", "апробация", "атриум", "психастения", "коробейник",
		"десорбция", "олеандр", "палеолит", "целовальник", "жакет", "паспарту",
		"беспризорник", "абстиненция", "голь", "крокет", "валежник", "пигмент",
		"поперечина", "сейсмография", "синеклиза", "вафельница",
		"затверделость", "префект", "выдра", "крузейро", "пиетет", "урбанизм",
		"метанарратив", "провинциализм", "касторка", "номенклатура",
		"перфокарта", "возгонка", "геральдика", "исламоведение", "непоседа",
		"анаграмма" ];

var myDictionary = dictionary.slice();

var first = true;

function initResultPage() {
	console.log("ready for new game");
	$(document).on('pageinit', function() {
		if (!first) {
			first = true;
			return;
		} else {
			first = false;
		}

		console.log("Раунд " + roundNumber);
		chooseIndexAndTeam();
		console.log("init");
		showTeamsAndScore();
		initGameElements();
	});
}

var teamIndex = -1;
var roundNumber = 1;

function chooseIndexAndTeam() {
	teamIndex++;
	if (teamIndex > teams.length - 1) {
		teamIndex = 0;
		checkForWin();
		roundNumber++;
	}
	$('#roundNumber').text("Раунд " + roundNumber);
	console.log(teamIndex);
	console.log(teams[teamIndex].name);
	$('#nextTeamPlayName').text(teams[teamIndex].name);
}

var winners = [];

function clearResults() {
	winners = [];
	team.score = 0;
	team2.score = 0;
	roundNumber = 1;
	teams = [ team, team2 ];
}

function checkForWin() {
	teams.forEach(function(item, i, arr) {
		if (item.score >= wordsForWin) {
			winners.push(item.name);
		}
	});
	if (winners.length == 1) {
		alert("Победила команда " + winners[0] + "!");
		clearResults();
		$.mobile.changePage('index.html');
		initFirstPage();
	} else if (winners.length > 1) {
		var s = "Победили команды: ";
		for (var i = 0; i < winners.length; i++) {
			s += winners[i];
			if (i + 1 < winners.length) {
				s += ", ";
			}
		}
		alert(s + "!");
		clearResults();
		$.mobile.changePage('index.html');
		initFirstPage();
	}
}

function showTeamsAndScore() {
	if (isEmpty($('#teams'))) {
		appendTeams()
	} else {
		var myNode = document.getElementById("teams");
		while (myNode.firstChild) {
			myNode.removeChild(myNode.firstChild);
		}
		appendTeams();
	}
	$('#teams').listview('refresh');
}

function updateScore() {
	teams[teamIndex].score = teams[teamIndex].score + score;
	console.log("набранные очки: " + score);
	console.log("всего у команды " + teams[teamIndex].name + " "
			+ teams[teamIndex].score + " очков");
	score = 0;
}

var intId = 0;

function startTimer() {
	var my_timer = document.getElementById("my_timer");
	var s = my_timer.innerHTML;
	if (s == 0) {
		clearInterval(intId);
		$('#btnAcceptWord').unbind();
		$('#btnMissWord').unbind();
		updateScore();
		$.mobile.changePage('ready.html');
		return;
	} else {
		s--;
		if (s < 10)
			s = "0" + s;
		document.getElementById("my_timer").innerHTML = s;
	}
}

var second = true;

function initGameElements() {
	$('#btnGame').bind('click', function() {
		$.mobile.changePage('game.html')
		console.log("game is started!");
		$(document).bind("pageinit", function() {
			if (!second) {
				second = true;
				return;
			} else {
				second = false;
			}

			$('#my_timer').text(time);
			getAndShowRandomWord();

			if (intId) {
				clearInterval(intId);
				$('#btnAcceptWord').unbind();
				$('#btnMissWord').unbind();
			}

			intId = setInterval(function() {
				startTimer()
			}, 1000);
			initScoreButtons();
		});
	})
}

function getRandomIndexOfDictionary(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getAndShowRandomWord() {
	var index = getRandomIndexOfDictionary(0, myDictionary.length);
	var word = myDictionary[index];
	if (index > -1) {
		myDictionary.splice(index, 1); // выкидываем слово из копии словаря
	}
	$('#wordScreen').text(word);
	if (myDictionary.length == 0) {
		myDictionary = secondDictionary.slice();
	}
}

function initScoreButtons() {
	$('#btnAcceptWord').bind('click', function() {
		var my_score2 = document.getElementById("score");
		score = my_score2.innerHTML;
		score++;
		console.log(score);
		document.getElementById("score").innerHTML = score;
		getAndShowRandomWord();
	});
	$('#btnMissWord').bind('click', function() {
		var my_score3 = document.getElementById("score");
		score = my_score3.innerHTML;
		score--;
		console.log(score);
		document.getElementById("score").innerHTML = score;
		getAndShowRandomWord();
	});
}

function appendTeams() {
	teams.forEach(function(item, i, arr) {
		console.log("Вывод: ");

		$('#teams').append(
				'<li>' + '<div>' + '<span> <b>' + item.id + '. '
						+ '</b> </span>' + '<span>' + item.name + '</span>'
						+ '<span style="float: right">' + item.score
						+ '</span>' + '</div>' + '</li>');

	});
}

function isEmpty(el) {
	return !$.trim(el.html())
}

var secondDictionary;
var wordsForWin = 10; // ползунок
var time = 10;
var numberTeam = 2;
var third = true;

function initTeamChoosingScreen() {
	$(document).bind("pageinit", function() {
		if (!third) {
			third = true;
			return;
		} else {
			third = false;
		}
		btnAdd();
		btnDelete();
		btnGoToSetting();
		showTeamListAndRefresh();
	});
}

function btnGoToSetting() {
	$('#btnGoToSettingPage').bind('click', function() {
		$(document).bind("pageinit", function() {
			if (!third) {
				third = true;
				return;
			} else {
				third = false;
			}
			btnGoToReadyPage()
		});
	})
}

function btnGoToReadyPage() {
	$('#btnGoToReadyPage').bind('click', function() {

		// если кол-во слов больше 10, то ставим, если нет, то оставляем по
		// дефолту: 10
		var val = $('#textView1').val();
		if (val > 10 && val <= 50) {
			wordsForWin = val;
		}

		// время одного раунда
		val = $('#textView2').val();
		if (val > 10) {
			time = val;
		}

		// e.value - тут лежит сложность игры, т.е. t1 - обычная, t2 - высокая
		var complexity = document.getElementById("complexity");
		if (complexity === "t1") {
			myDictionary = dictionary.slice();
			secondDictionary = hardDictionary.slice();
		} else if (complexity === "t2") {
			myDictionary = hardDictionary.slice();
			secondDictionary = dictionary.slice();
		}

		initResultPage();

	})
}

function btnAdd() {
	$('#btnAddTeam').bind('click', function() {
		addNewTeam();
	})
}

function addNewTeam() {
	numberTeam++;
	var team = {
		id : numberTeam,
		name : "Команда " + numberTeam,
		score : 0
	};
	teams.push(team);
	showTeamListAndRefresh();
}

function showTeamListAndRefresh() {
	$('#listViewTeam').empty();
	for (var i = 0; i < teams.length; i++) {
		$('#listViewTeam').append(
				'<li>' + '<span>' + teams[i].name + '</span>' + '</li>')
				.listview('refresh');
	}
}

// удаление команды
function btnDelete() {
	$('#btnDelete').bind('click', function() {
		if (numberTeam > 2) {
			teams.pop();
			numberTeam--;
		}
		showTeamListAndRefresh();
	})
}

$(document).bind('pageinit', init);
$(document).unload(unregister);
