$("document").ready(function () {
    $(".edit-post").click(function () {
        let query = $(this).parent().parent().parent().parent()
        let ref = query.data('ref')
        let body = query.find('p').text()
        let options = $(this).parent().parent()
        console.log(query.find('p').text());
        query.find('p').html(`<textarea id="post-text" class="form-control">${body}</textarea>`)
        autosize($('#post-text'))

        query.find('p').append("<br><button class='btn btn-primary mr-1 edit_submit'>Save</button><button class='btn btn-primary edit_cancel'>Cancel</button>");
        options.hide();

        $("button.edit_cancel").click(function () {
            let text = body;

            console.log('canceled')
            $("#post-text").remove();
            $(".edit_cancel").remove();
            $(".edit_save").remove();

            query.find('p').text(text)
            options.show();
        })

        $("button.edit_submit").click(function () {
            console.log("attempting to save")
            let new_text = $('#post-text').val();
            $.ajax({
                type: "put",
                url: `/edit/post/${ref}`,
                data: {
                    text: new_text
                },
                success: function (res) {
                    $("textarea").remove();
                    query.find('p').text(new_text)
                    options.show();

                }
            })
        })

        return false;
    })

    $(".delete-post").click(function () {

        let query = $(this).parent().parent().parent().parent()
        let ref = query.data('ref')

        if (confirm("Are you sure you want to delete?")) {
            $.ajax({
                type: "delete",
                url: `/delete/post/${ref}`,
                success: function (res) {
                    query.remove();
                }
            });
        }
        return false;
    })

    $(".save-post").click(function () {
        let query = $(this).parent().parent().parent().parent()
        let ref = query.data('ref')
        console.log($(this).text());

        if ($(this).text() == "save") {
            $.ajax({
                type: "put",
                url: `/save/post/${ref}`,
            });
            $(this).text('unsave');

        } else {
            $.ajax({
                type: "put",
                url: `/unsave/post/${ref}`,

            });
            $(this).text('save');
        }
        return false;
    })

    $(".upvote-post").click(function () {

        let query = $(this).parent().find('span')
        let ref = $(this).parent().find('span').data('ref')
        let counter;

        if (query.hasClass('down-enabled')) {
            query.removeClass("down-enabled");
            counter = query.text();
            query.text(++counter);
        } else if (!query.hasClass("up-enabled")) {
            counter = query.text();
            query.text(++counter);
            query.addClass("up-enabled");

            $.ajax({
                type: "put",
                data: {
                    vote: counter
                },
                url: `/vote/post/${ref}`,
                success: function (res) {
                    alert("vote submited")
                }
            });
        }
        return false;
    });

    $(".downvote-post").click(function () {
        let query = $(this).parent().find('span')
        let ref = $(this).parent().find('span').data('ref')
        let counter;

        if (query.hasClass('up-enabled')) {
            query.removeClass("up-enabled");
            counter = query.text();
            query.text(--counter);
        } else if (!query.hasClass("down-enabled")) {
            counter = query.text();
            query.text(--counter);
            query.addClass("down-enabled");

            $.ajax({
                type: "put",
                data: {
                    vote: counter
                },
                url: `/vote/post/${ref}`,
                success: function (res) {
                    alert("vote submited")
                }
            });
        }
        return false;
    });
});