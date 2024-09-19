import bible from '../Bible.json'
import books from '../Books.json'

const Chapter = ({bookIndex, chapterIndex}) => {

    const chapter = bible[bookIndex][chapterIndex];
    const book = books[bookIndex];
    return (
        <div lang='ar' dir='rtl'>
            <h3><strong>{book} {chapterIndex}</strong></h3>
            {Object.entries(chapter).map(([verseNumber, verseText]) => (
                <p key={verseNumber}>
                <strong>{verseNumber}:</strong> {verseText} {/* Display each verse */}
                </p>
            ))}
        </div>
    )
}

export default Chapter;