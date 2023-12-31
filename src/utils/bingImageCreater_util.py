import BingImageCreator
import sys

def main(u, prompt):     
    bingimg = BingImageCreator.ImageGen(
        auth_cookie=u,
        auth_cookie_SRCHHPGUSR=u,
        quiet=True,
    )

    try:
        result_url = bingimg.get_images(prompt)
        print(result_url)

    except Exception as e:
        print(e)


if __name__ == "__main__":
    _U = sys.argv[1]
    prompt = sys.argv[2]

    main(_U, prompt)