const MAX_ARTICLE_NUMBER = 12;
const API_KEY = "b0d2e78ec76340b08e94f63c93132731";

function findImage(multimedia, format) {
    for (let i = 0; i < multimedia.length; i++) {
        const currentImage = multimedia[i];
        if (currentImage.format === format) {
            return currentImage;
        }
    }
}

function extractArticleData(article) {
    const abstract = article.abstract;
    const multimedia = findImage(article.multimedia, "superJumbo");
    if (!multimedia) {
        return null;
    }
    const imageUrl = multimedia.url;
    return {
        abstract: abstract,
        imageUrl: imageUrl,
        url: article.url
    };
}

function renderArticle(articleData, articleNode) {
    articleNode.css("background-image", `linear-gradient(black, black), url(${articleData.imageUrl})`);
    $("p", articleNode).text(articleData.abstract);
    articleNode.on("click", function () {
        window.open(articleData.url, "_blank");
    });
}

function loadArticles(section) {
    $("body").addClass("loading").addClass("article-view");

    let url = `https://api.nytimes.com/svc/topstories/v2/${section}.json`;
    url += "?" + $.param({
        "api-key": API_KEY
    });

    $.ajax({
        url: url,
        method: "GET"
    }).done(function (data) {
        $("body").removeClass("loading");
        $("#articleContainer").empty();
        let counter = 0;
        for (let i = 0; i < data.results.length && counter < MAX_ARTICLE_NUMBER; i++) {
            const result = data.results[i];
            const articleData = extractArticleData(result);
            if (articleData) {
                counter++;
                const articleNode = $("<article><p></p></article>");
                $("#articleContainer").append(articleNode);
                renderArticle(articleData, articleNode);
            }
        }


    }).fail(function (err) {
        throw err;
    });
}

function hideArticles() {
    $("body").removeClass("loading").removeClass("article-view");
    $("#articleContainer").empty();
}


$(function () {
    const sectionSelect = $("#nyt_section_select");
    sectionSelect.on("change", function () {
        const sectionSelectValue = sectionSelect.val();
        window.location.hash = sectionSelectValue;
        if (sectionSelectValue) {
            loadArticles(sectionSelectValue);
        } else {
            hideArticles();
        }
    });
    if (window.location.hash) {
        sectionSelect.val(window.location.hash.substr(1)).change();
    }
});
