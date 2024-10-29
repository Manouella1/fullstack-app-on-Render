<template>
  <div>
    <h3>Comments</h3>
    <!-- New Comment Section -->
    <div>
      <textarea
        v-model="newCommentContent"
        placeholder="Write a comment..."
      ></textarea>
      <button @click="postNewComment">Submit Comment</button>
    </div>

    <!-- Existing Comments -->
    <div v-for="comment in comments" :key="comment.id" class="comment">
      <p>
        <strong>{{ comment.username }}:</strong> {{ comment.content }}
      </p>
      <small
        >Posted on: {{ new Date(comment.created_at).toLocaleString() }}</small
      >
      <button @click="quoteComment(comment)">Reply</button>
    </div>

    <!-- Reply Section -->
    <div v-if="isReplying">
      <textarea
        v-model="replyContent"
        placeholder="Write a reply..."
      ></textarea>
      <button @click="postComment">Submit Reply</button>
      <button @click="cancelReply">Cancel</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { api } from "../services/api";
import { defineProps } from "vue";

interface Comment {
  id: number;
  username: string;
  content: string;
  created_at: string;
  parent_comment_id?: number;
}

const props = defineProps<{ postId: number }>();
const comments = ref<Comment[]>([]);
const isReplying = ref(false);
const replyContent = ref("");
const newCommentContent = ref(""); // Added newCommentContent ref
let parentCommentId: number | null = null;

const fetchComments = async () => {
  try {
    const response = await api.get(
      `https://fullstack-app-on-render.onrender.com/posts/${props.postId}/comments`
    );
    comments.value = response.data.comments;
  } catch (error) {
    console.error("Failed to load comments:", error);
  }
};

const quoteComment = (comment: Comment) => {
  isReplying.value = true;
  replyContent.value = `> ${comment.content}\n\n`; // Quote format
  parentCommentId = comment.id;
};

const postComment = async () => {
  try {
    await api.post(
      `https://fullstack-app-on-render.onrender.com/posts/${props.postId}/comments`,
      {
        content: replyContent.value,
        parentCommentId: parentCommentId,
      }
    );
    replyContent.value = "";
    isReplying.value = false;
    parentCommentId = null;
    await fetchComments(); // Refresh comments after posting
  } catch (error) {
    console.error("Failed to post comment:", error);
  }
};

// Add the postNewComment function here
const postNewComment = async () => {
  try {
    await api.post(
      `https://fullstack-app-on-render.onrender.com/posts/${props.postId}/comments`,
      {
        content: newCommentContent.value,
      }
    );
    newCommentContent.value = ""; // Clear the textarea after posting
    await fetchComments(); // Refresh comments after posting
  } catch (error) {
    console.error("Failed to post new comment:", error);
  }
};

const cancelReply = () => {
  isReplying.value = false;
  replyContent.value = "";
  parentCommentId = null;
};

onMounted(fetchComments);
</script>

<style scoped>
.comment {
  border-bottom: 1px solid #ddd;
  padding: 8px 0;
  margin-bottom: 8px;
}
</style>
