// Document ready setup
$(documentSetup);

const DEFAULT_DIMENSION = 7;
var dimension = DEFAULT_DIMENSION;
var evenData = [];
var triplesData = [];
var posData = [];
var bigData = [];

function documentSetup() {
    setupDimensionSelector($("#dimension-selector"));
    dimensionDependentSetup();
    $("#generate-puzzle").on("click", function() {
        extractTable($("table.puzzle-input.even-odd"), evenData);
        extractTable($("table.puzzle-input.triples"), triplesData);
        extractTable($("table.puzzle-input.pos-neg"), posData);
        extractTable($("table.puzzle-input.big-small"), bigData);
        generateTable($("table.puzzle-display"));
        $("table.puzzle-display").show();
    });
    activateTable($("table.puzzle-display"));
    activateTable($("table.puzzle-input"));
    $("#hide-gen").on("click", function() {
        $(".puzzle-gen-only").toggle();
    })
}

function dimensionDependentSetup() {
    populateTable($("table.puzzle-display"));
    $("table.puzzle-display").hide();
    populateTable($("table.puzzle-input"), () => "&nbsp;");
}

function setupDimensionSelector(input) {
    input.val(dimension);
    insertDimension();
    input.on("change", function() {
        dimension = input.val();
        insertDimension();
        dimensionDependentSetup();
    })
}

function generateTable(table) {
    table.find("tr").each(function (row) {
        $(this).find("td").each(function (col) {
            $(this).text(`${generateNumber(triplesData[row][col], evenData[row][col], bigData[row][col], posData[row][col])}`);
        });
    });
}

function populateTable(table, populator = (i, j) => `${i+j}`) {
    table.children("tbody").remove();
    table.append($("<tbody>"));
    const body = table.children("tbody")
    for (var i = 0; i < dimension; i++) {
        var row = $("<tr>");
        for (var j = 0; j < dimension; j++) {
            row.append($("<td>").html(populator(i, j)))
        }
        body.append(row);
    }
}

function insertDimension() {
    $("span.dimension-constant").text(`${dimension}`);
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

function loadImageFromFilesElt(filechooser, img) {
    const [file] = filechooser.files;
    if (file) {
        img.src = URL.createObjectURL(file);
    }
}

function randInRange(count) {
    return Math.floor(Math.random()*count);
}

function generateNumber(isTriple, isEven, isBig, isNegative) {
    const seed = randInRange(16); // a range that will fit under 100 for multiples of 6
    var number = seed + 1;

    function getSixOffset() {
        if (isTriple && isEven) {
            return 6;
        } else if (isTriple && !isEven) {
            return 3;
        } else if (!isTriple && isEven) {
            return 2 * (1 + randInRange(2)); // 2 or 4
        } else {
            // !isTriple, !isEven
            return 1 + 4 * randInRange(2); // 1 or 5
        }
    }

    number *= 6;
    number += getSixOffset() - 6;

    // Big
    if (isBig) {
        number += 102; // smallest number >= 99 that is divisible by 6
    }

    // Pos/Neg
    if (isNegative) {
        number *= -1;
    }
    return number;
}