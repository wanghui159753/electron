<template>
  <div class="m-chat-emoji">
    <div class="emoji-content scrollbar">
      <div class="cnt">
        <span class="emoji-item" :class="{'pinup-item':item.type==='pinup'}" v-for="(item,index) in currEmoji.list" :key="index" @click.stop="selectEmoji(item)">
          <img :src="item.img">
        </span>
      </div>
    </div>
    <!-- <div class="emoji-channel">
      <span class="emoji-album" :class="{active: item.name==currAlbum}" v-for="(item,index) in emoji" :key="index" @click.stop="selectAlbum(item)">
        <img :src="item.album">
      </span><span v-if="type==='session'" class="emoji-album" :class="{active: item.name==currAlbum}" v-for="(item,index) in pinup" :key="index" @click.stop="selectAlbum(item)">
        <img :src="item.album">
      </span>
    </div> -->
  </div>
</template>

<script>
import emojiObj from "@/configs/emoji";

function genEmojiList(type, emojiList) {
  let result = {};
  for (let name in emojiList) {
    let emojiMap = emojiList[name];
    let list = [];
    for (let key in emojiMap) {
      list.push({
        type,
        name,
        key,
        img: emojiMap[key].img
      });
    }
    if (list.length > 0) {
      result[name] = {
        type,
        name,
        list,
        album: list[0].img
      };
    }
  }
  return result;
}

export default {
  props: {
    type: String,
    scene: String,
    to: String
  },
  data() {
    return {
      currType: "emoji",
      currAlbum: "emoji"
    };
  },
  computed: {
    emoji() {
      return genEmojiList("emoji", emojiObj.emojiList);
    },
    pinup() {
      return genEmojiList("pinup", emojiObj.pinupList);
    },
    currEmoji() {
      if (this.currType === "emoji") {
        return this.emoji[this.currAlbum];
      } else if (this.currType === "pinup") {
        return this.pinup[this.currAlbum];
      }
      return [];
    }
  },
  methods: {
    selectAlbum(album) {
      this.currType = album.type;
      this.currAlbum = album.name;
      
    },
    selectEmoji(emoji) {
       //this.$emit("movingcursor")
      if (this.currType === "emoji") {
        // 由触发父组件事件，增加表情文案
        this.$emit("add-emoji", emoji.key);
      } else if (this.currType === "pinup") {
        if (this.type === "session") {
          this.$store.dispatch("sendMsg", {
            type: "custom",
            scene: this.scene,
            to: this.to,
            pushContent: "[贴图表情]",
            content: {
              type: 3,
              data: {
                catalog: this.currAlbum,
                chartlet: emoji.key
              }
            }
          });
        } else if (this.type === "chatroom") {
          this.$store.dispatch("sendChatroomMsg", {
            type: "custom",
            pushContent: "[贴图表情]",
            content: {
              type: 3,
              data: {
                catalog: this.currAlbum,
                chartlet: emoji.key
              }
            }
          });
        }
        
        this.$emit("hide-emoji");
      }
      
    }
  }
};
</script>

<style type="text/css" lang="scss">
.m-chat-emoji {
  position: absolute;
  top: -250px;
  height: 240px;
  left: -120px;
  width: 100%;
  background-color: #fff;
  .emoji-channel {
    position: relative;
    width: 100%;
    height: auto;
    margin: 0 1rem;
    .emoji-album {
      display: inline-block;
      padding: 10px;
      width: 10px;
      height: 10px;
      border-right: 1px solid #f0f0f0;
      img {
        margin: 0;
        display: block;
        width: inherit;
        height: inherit;
      }
      &.active {
        background-color: #f0f0f0;
      }
    }
  }
  .emoji-content {
    position: relative;
    width: 460px;
    height: 240px;
    overflow-y: auto;
    box-shadow: 0px 0px 8px 6px #ddd !important;
    background: #fff;
    .cnt {
      position: relative;
      display: block;
      margin: 0.4rem auto;
      text-align: left;
      background-color: #fff;
      border-radius: 10px;
      padding: 10px;
    }
    .emoji-item {
      display: inline-block;
      width: 28px;
      height: 28px;
      padding: 4px 10px;
      vertical-align: middle;
      /*border: 1px solid #fff;*/
      margin-left: 4px;
      /*margin-bottom: -1px;*/
      img {
        width: inherit;
        height: inherit;
      }
    }
    .pinup-item {
      width: 44px;
      height: 44px;
    }
  }
}
</style>
