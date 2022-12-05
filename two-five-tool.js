// Document ready setup
$(documentSetup);

const DIMENSION = 7;
var evenData = [];
var fivesData = [];
var posData = [];
var bigData = [];

function documentSetup() {
    insertDimension();
    populateTable($("table.puzzle-display"));
    populateTable($("table.puzzle-input"), () => "&nbsp;");
    activateTable($("table.puzzle-display"));
    activateTable($("table.puzzle-input"));
    attachFileToImage("even-odd");
    attachFileToImage("big-small");
    attachFileToImage("pos-neg");
    attachFileToImage("fives");
    $("#generate-puzzle").on("click", function() {
        extractTable($("table.puzzle-input.even-odd"), evenData);
        extractTable($("table.puzzle-input.fives"), fivesData);
        extractTable($("table.puzzle-input.pos-neg"), posData);
        extractTable($("table.puzzle-input.big-small"), bigData);
        generateTable($("table.puzzle-display"));
    });
    $("#hide-gen").on("click", function() {
        $(".puzzle-gen-only").toggle();
    })
}

function generateTable(table) {
    table.find("tr").each(function (row) {
        $(this).find("td").each(function (col) {
            $(this).text(`${generateNumber(fivesData[row][col], evenData[row][col], bigData[row][col], posData[row][col])}`);
        });
    });
}

function populateTable(table, populator = (i, j) => `${i+j}`) {
    if (table.children("tbody").length == 0) {
        table.append($("<tbody>"));
    }
    const body = table.children("tbody")
    for (var i = 0; i < DIMENSION; i++) {
        var row = $("<tr>");
        for (var j = 0; j < DIMENSION; j++) {
            row.append($("<td>").html(populator(i, j)))
        }
        body.append(row);
    }
}

function insertDimension() {
    $("span.dimension-constant").text(`${DIMENSION}`);
}

function activateTable(table) {
    var dragging = false;
    table.on("mousedown", function() {
        dragging = true;
    })
    table.on("mouseup", function() {
        dragging = false;
    })
    table.on("mousedown", "td", function() {
        $(this).toggleClass('puzzle-selected');
    })
    table.on("mouseenter", "td", function() {
        if (dragging) {
            $(this).toggleClass('puzzle-selected');
        }
    })    
}

function extractTable(table, data) {
    // Clear the table.
    data.length = 0;

    table.find("tr").each(function () {
        var row = [];
        $(this).find("td").each(function () {
            row.push($(this).hasClass("puzzle-selected"));
        });
        data.push(row);
    });
}

function attachFileToImage(selectTextRoot) {
    $(`#${selectTextRoot}-source`).on("change", (evt) => {
        loadImageFromFilesElt(evt.currentTarget, $(`img.source-display.${selectTextRoot}`)[0]);
    });
}

function loadImageFromFilesElt(filechooser, img) {
    const [file] = filechooser.files;
    if (file) {
        img.src = URL.createObjectURL(file);
    }
}

function randInRange(count) {
    return Math.floor(Math.random()*count);
}

function generateNumber(isfive, isEven, isBig, isPositive) {
    const seed = randInRange(19); // a range that will fit under 200 for multiples of 10
    var number = seed + 1;

    function getTen() {
        if (isfive && isEven) {
            return 10;
        } else if (isfive && !isEven) {
            return 5;
        } else if (!isfive && isEven) {
            return 2 * randInRange(4) + 2; // 2, 4, 6, 8
        } else {
            // !isfive, !isEven
            if (randInRange(2) > 0) {
                return randInRange(2) * 2 + 7;
            } else {
                return randInRange(2) * 2 + 1;
            }
        }
    }

    number *= 10;
    number += getTen() - 10;

    // Big
    if (isBig) {
        number += 200; // smallest number >= 200 that is divisible by 10
    }

    // Pos/Neg
    if (!isPositive) {
        number *= -1;
    }
    return number;
}