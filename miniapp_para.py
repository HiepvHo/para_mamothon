from telegram import InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler
from telegram import Update

API_TOKEN = "7001964840:AAE7mPwUgOiXckLrsAPoA2lGht_Ut0Lryp0"

async def open_miniapp(update: Update, context) -> None:
    keyboard = [
        [InlineKeyboardButton("Open Mini-App", url="https://para-miniapp.vercel.app")]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text('Click below to open the Mini-App:', reply_markup=reply_markup)

def main():
    application = Application.builder().token(API_TOKEN).build()
    application.add_handler(CommandHandler('start', open_miniapp))
    application.run_polling()

if __name__ == '__main__':
    main()
