<template>
    <p>{{dateString}}</p>
</template>

<script>
export default {
  name: 'DateView',
  props: {
    date: Date,
    time: Boolean
  },
  computed: {
      dateString() {
            if(this.date === null) {
                return "";
            }
            let res = (this.date.getMonth()+1) + "/" + this.date.getDate() + "/" + this.date.getFullYear();

            if(!this.time) {
                res += " - " + this.date.getHours() + ":" + this.date.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
            }

            return res;
        },
      dayOfWeek() {
          let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          return days[this.date.getDay()||0];
      }
  }
}
</script>