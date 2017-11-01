Vue.component('comments', {
    template: `
        <div>
            <article class="media" v-for="comment in comments">
                <div class="media-content">
                    <div class="content">
                        <p>
                            <strong :title="userTitle(comment)" v-text="cropIdProvider(comment.cert_user_id)"></strong>
                            <br>
                            <div class="wrapped"
                                @blur="cancel(comment.comment_id)"
                                :contentEditable="comment_id == comment.comment_id"
                                :ref="'comment' + comment.comment_id">{{ comment.body }}</div>
                            <br>
                            <a class="button is-danger"
                                @mouseenter="deleteHover(true)"
                                @mouseout="deleteHover(false)"
                                v-if="comment_id == comment.comment_id">Delete</a>
                            <a class="button" 
                                @mouseenter="saveHover(true)"
                                @mouseout="saveHover(false)"
                                v-if="comment_id == comment.comment_id">Save</a>
                            <br v-if="comment_id == comment.comment_id">
                            <br v-if="comment_id == comment.comment_id">
                            <small><a @click="reply(comment.cert_user_id)">Reply</a> · {{ comment.date_added | fromNow }}</small>
                        </p>
                    </div>
                </div>
                <div class="media-right">
                    <span class="pointer" v-if="own(comment.cert_user_id)" @click="edit(comment)"><i class="fa pointer fa-pencil"></i></span>
                </div>
            </article>
            <article class="media">
                <div class="media-content">
                    <div class="field">
                        <p class="control">
                            <textarea class="textarea" placeholder="Add a comment..." v-model="newComment"></textarea>
                        </p>
                    </div>
                    <div class="field">
                        <p class="control">
                            <button class="button" @click="save()">Post comment</button>
                        </p>
                    </div>
                </div>
            </article>
        </div>
    `,

    props: ['post'],

    data() {
        return {
            commentText: '',
            comment_id: undefined,
            isDeleteHover: false,
            isSaveHover: false,
            newComment: ''
        }
    },

    computed: {
        comments() {
            if (this.post.post_id in storage.state.comments) {
                return storage.state.comments[this.post.post_id]
            }
        }
    },

    filters: {
        fromNow: (value) => {
            return moment(value, 'x').fromNow()
        }
    },

    methods: {
        save(id) {
            if (id != undefined) {
                poster.saveComment(this.post.post_id, this.$refs['comment' + id][0].innerHTML, id)
            } else {
                poster.saveComment(this.post.post_id, this.newComment)
                this.newComment = ''
            }
        },

        reply(id) {
            this.commentText += this.cropIdProvider(id) + ", "
        },
        
        userTitle(comment) {
            return comment.cert_user_id + ': ' + comment.directory.replace('users/', '')
        },

        cropIdProvider(id) {
            return id.split('@')[0]
        },

        own(cert) {
            return cert == storage.state.site_info.cert_user_id
        },

        del(id) {
            poster.delComment(id)
        },

        edit(comment) {
            this.commentText = comment.body
            this.comment_id = comment.comment_id
            this.$nextTick(() => {
                this.$refs['comment' + comment.comment_id][0].focus()
            })
        },

        deleteHover(state) {
            this.isDeleteHover = state
        },

        saveHover(state) {
            this.isSaveHover = state
        },

        cancel(id) {
            if (this.isDeleteHover) {
                this.del(id)
            } else if (this.isSaveHover) {
                this.save(id)
            } else {
                this.$refs['comment' + id][0].innerHTML = this.commentText
            }
            this.isDeleteHover = false
            this.isSaveHover = false
            this.commentText = ''
            this.comment_id = undefined
        }
    }
})
