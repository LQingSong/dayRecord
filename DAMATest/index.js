const { createApp, ref, reactive, toRaw } = Vue;
var qs = Qs;
const app = createApp({
  setup() {
    const qType = ref("");
    const qTitle = ref("");
    const qOptions = ref([""]);

    // TODO：localStorage 本地持久化, 避免刷新丢失
    const questionBank = [];

    function handleSave() {
      const type = qType.value,
        title = qTitle.value,
        options = toRaw(qOptions.value);
      if (!type) {
        alert("请选择题目类型");
        return;
      }
      if (!title) {
        alert("请输入题目");
        return;
      }
      if (options === [""]) {
        alert("请输入选项");
        return;
      }

      const item = {
        type,
        title,
        options,
      };
      questionBank.push(item);

      console.log(questionBank);
    }

    const checkBindValue = (e) => {
      const { _value } = e.target;
      qType.value = _value;
    };

    function handleAddOption() {
      qOptions.value.push("");
    }

    function handleSubmit(data) {
      fetch("http://localhost:3001/save", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
        mode: "cors",
      }).then(async (res) => {
        const data = await res.text();
        console.log("data ---->", data);
      });
    }

    return {
      qType,
      qTitle,
      qOptions,
      handleSave,
      checkBindValue,
      handleAddOption,
      handleSubmit,
    };
  },
});
app.mount("#app");
