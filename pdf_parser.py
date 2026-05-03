import fitz  # PyMuPDF


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extract all text from a PDF given its raw bytes.
    Returns a single string with all page content.
    """
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        full_text = ""
        for page_num, page in enumerate(doc):
            full_text += f"\n--- Page {page_num + 1} ---\n"
            full_text += page.get_text()
        doc.close()
        return full_text.strip()
    except Exception as e:
        return f"Error extracting PDF: {str(e)}"
