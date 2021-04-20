//（）為IIFFEE將函式變為立即函式
(
  function () {
    const BASE_URL = 'https://movie-list.alphacamp.io'
    const INDEX_URL = BASE_URL + '/api/v1/movies/'
    const POSTER_URL = BASE_URL + '/posters/'
    const dataPanel = document.querySelector('#data-panel')
    const data = JSON.parse(localStorage.getItem('favoriteMovies')) || []

    displayDataList(data)

    function displayDataList(data) {
      let htmlContent = ''
      data.forEach(function (item, index) {
        htmlContent += `
<div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h6 class="card-title">${item.title}</h6>
            </div>
           
            <!-- Button trigger modal -->
            <div class="card-footer">
              <button type="button" class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#show-movie-modal" data-id="${item.id}">
                More
              </button>
            <!-- delete button 在電影卡片上刪除收藏-->
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
            </div>
          </div>
        </div>
      `
      })

      dataPanel.innerHTML = htmlContent
    }

    //綁定元素
    //modal-header
    const movieTitle = document.querySelector('#show-movie-title')
    //modal-body > img > reslease date > description
    const movieImg = document.querySelector('#show-movie-image')
    const movieDate = document.querySelector('#show-movie-date')
    const movieDes = document.querySelector('#show-movie-description')
    //50個按鈕監聽>綁定在父元素datapanel
    dataPanel.addEventListener('click', (event) => {
      //只要class選擇器中含有button的相應class
      if (event.target.matches('.btn-show-movie')) {
        //但我們要讓按鈕告訴我們是哪部電影 所以可以使用dataset先在按鈕上設置獨特相應的電影id
        showsinglemovie(event.target.dataset.id)
        //刪除電影
      } else if (event.target.matches('.btn-remove-favorite')) {
        //監聽刪除按鈕的點擊事件
        removeFavoriteItem(event.target.dataset.id)

      }
    })
    //新增modal單筆電影資料：另獨立於一個函式
    function showsinglemovie(id) {
      let url = INDEX_URL + id
      //找單筆電影資料
      axios
        .get(url)
        .then((res) => {
          //變數只會存活於此
          let data = res.data.results
          console.log(data)
          movieTitle.innerHTML = `${data.title}`
          //記得這裡要插入img標籤並在src中連上正確圖片位置
          movieImg.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt = "Responsive image" >`
          movieDate.innerHTML = `release_date： ${data.release_date}`
          movieDes.innerHTML = `${data.description}`
        })
        .catch((err) => {
          console.log(err)
        })
    }

    //刪除收藏的單筆電影資料
    function removeFavoriteItem(id) {
      // find movie by id
      const index = data.findIndex(item => item.id === Number(id))
      if (index === -1) return

      // remove movie and update localStorage
      data.splice(index, 1)
      localStorage.setItem('favoriteMovies', JSON.stringify(data))

      // repaint dataList
      displayDataList(data)
    }

  })()