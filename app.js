window.addEventListener("load", function () {
  const $ = this.document.querySelector.bind(this.document);
  const $$ = this.document.querySelectorAll.bind(this.document);

  let storage = [];

  const app = {
    handleEvent() {
      const add = document.querySelectorAll(".content-add");
      const addcontent = document.querySelector(".addcontent");
      const cancel = document.querySelector(".cancel");
      const addtask = document.querySelector(".addtask");
      const statuses = document.getElementsByName("status");
      const footerList = $$(".footer div");
      const listTodo = $("#todo");
      const listProgress = $("#inProgress");
      const listCompleted = $("#completed");

      document.addEventListener("click", function (e) {
        if (e.target.matches(".addcontent")) {
          addcontent.classList.remove("is-show");
        }
        if (e.target.matches(".buttonStatus")) {
          app.handleSwitch(e.target);
        }

        if (
          e.target.matches(".showContent-1") ||
          e.target.matches(".showContent-1 p") ||
          e.target.matches(".showContent-1 i")
        ) {
          const parentSct1 = e.target.closest(".showContent-item");
          const sct2 = parentSct1.querySelector(".showContent-2");
          sct2.classList.toggle("showContent-2-active");
          const sct1 = e.target.closest(".showContent-1");
          const buttonAngle = sct1.querySelector(".showContent-1 i");
          const newButtonAngle = `<i class="fa-solid fa-angle-down"></i>`;
          const buttonAngle1 = `<i class="fa-solid fa-angle-up"></i>`;
          if (sct2.classList.contains("showContent-2-active")) {
            console.log(sct1);
            console.log(buttonAngle);
            sct1.removeChild(buttonAngle);
            sct1.insertAdjacentHTML("beforeend", newButtonAngle);
          } else {
            sct1.removeChild(buttonAngle);
            sct1.insertAdjacentHTML("beforeend", buttonAngle1);
          }
        }
      });

      add.forEach((i) =>
        i.addEventListener("click", function () {
          addcontent.classList.add("is-show");
          const value = i.parentNode.getAttribute("data-status");
          statuses.forEach((val) => {
            if (+val.getAttribute("value") === +value) {
              val.checked = true;
            }
          });
        })
      );

      cancel.addEventListener("click", function () {
        addcontent.classList.remove("is-show");
      });
      addtask.addEventListener("click", function () {
        addcontent.classList.remove("is-show");
      });

      footerList.forEach((i) => {
        i.addEventListener("click", function (e) {
          if (e.target.matches(".footer-list-1")) {
            listTodo.classList.remove("displayNone");
            listProgress.classList.add("displayNone");
            listCompleted.classList.add("displayNone");
            console.log("1");
          }
          if (e.target.matches(".footer-list-2")) {
            listTodo.classList.add("displayNone");
            listProgress.classList.remove("displayNone");
            listCompleted.classList.add("displayNone");
            console.log("2");
          }
          if (e.target.matches(".footer-list-3")) {
            listTodo.classList.add("displayNone");
            listProgress.classList.add("displayNone");
            listCompleted.classList.remove("displayNone");
            console.log("3");
          }
        });
      });
    },
    getInput() {
      const renderData = this.renderData.bind(this);

      const form = $(".form-1");
      let formData = {};

      form.addEventListener("submit", function (e) {
        e.preventDefault();

        if (
          this.elements["title"].value == "" ||
          this.elements["content"].value == "" ||
          this.elements["status"].value == "" ||
          this.elements["day"].value == ""
        ) {
          alert("Nhập cho đủ vào");
        } else {
          const id = Math.random();
          formData = {
            id: id,
            title: this.elements["title"].value,
            content: this.elements["content"].value,
            status: +this.elements["status"].value,
            day: this.elements["day"].value,
          };

          storage.push(formData);
          localStorage.setItem("tasktodolist", JSON.stringify(storage));
          form.reset();
          renderData(formData);
          app.countList();
        }
      });
    },

    renderData(data) {
      const listTask = [...$$(".content")];
      let todo = "";
      let inProgess = "";
      let completed = "";

      if (+data.status == 1) {
        todo = "is-active";
      }
      if (+data.status == 2) {
        inProgess = "is-active";
      }
      if (+data.status == 3) {
        completed = "is-active";
      }

      const html = `
    <div class="showContent-item" data-id="${data.id}">
      <div class="showContent-1">
        <p>${data.title}</p>
        <div class="buttonNode">
          <div
            class="buttonStatus ${todo}"
            style="background-color: #ff6b6b"
            data-status="1"
          ></div>
      <div
        class="buttonStatus ${inProgess}"
        style="background-color: #ffe066"
        data-status="2"
      ></div>
      <div
        class="buttonStatus ${completed}"
        style="background-color: #94d82d"
        data-status="3"
      ></div>
    </div >
    <i class="fa-solid fa-angle-up"></i>
  </div>
  <div class="showContent-2">
    <h4 class="showContent-title">${data.title}</h4>
    <p class="showContent-content">${data.content}</p>
    <div class="showContent-day">${data.day}</div>
  </div>
  </div>
    `;

      listTask.forEach((item) => {
        if (+item.getAttribute("data-status") === +data.status) {
          item
            .querySelector(".showContent")
            .insertAdjacentHTML("beforeend", html);
        }
      });
    },

    countList() {
      const listtask = $$(".showContent");
      listtask.forEach((item) => {
        item.parentNode.querySelector("p").innerText = item.childElementCount;
      });
    },

    switchTask(taskNode, list, listId) {
      const id = taskNode.getAttribute("data-id");
      console.log(id);
      taskNode.parentNode.removeChild(taskNode);
      list.appendChild(taskNode);

      app.countList();
      [...taskNode.querySelectorAll(".buttonStatus")].forEach((val) => {
        if (+val.getAttribute("data-status") === +listId) {
          val.classList.add("is-active");
        } else {
          val.classList.remove("is-active");
        }
      });

      storage.forEach((task) => {
        console.log(task);
        if (task.id == id) {
          task.status = +listId;
        }
      });
      localStorage.setItem("tasktodolist", JSON.stringify(storage));
    },

    handleSwitch(buttonNode) {
      const taskNode = buttonNode.parentNode.parentNode.parentNode;
      const listId = buttonNode.getAttribute("data-status");
      const listtask = $$(".content");
      listtask.forEach((item) => {
        if (+item.getAttribute("data-status") === +listId) {
          this.switchTask(taskNode, item.querySelector(".showContent"), listId);
        }
      });
    },

    initApp() {
      // Lấy dữ liệu từ LS; render nó ra
      if (!localStorage.getItem("tasktodolist")) {
        localStorage.setItem("tasktodolist", JSON.stringify([]));
      } else {
        storage = JSON.parse(localStorage.getItem("tasktodolist"));
      }
      storage.forEach((task) => {
        this.renderData(task);
      });
      this.countList();
    },

    run() {
      this.initApp();
      this.handleEvent();
      this.getInput();
      this.countList();
    },
  };
  app.run();
});
