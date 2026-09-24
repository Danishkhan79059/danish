import * as Minio from "minio";

const endpoint = process.env.MINIO_ENDPOINT || "s3.vizta.in";
const port = parseInt(process.env.MINIO_PORT || "443", 10);
const useSSL = process.env.MINIO_USE_SSL === "true" || process.env.MINIO_USE_SSL === true;
const accessKey = process.env.MINIO_ACCESS_KEY || "";
const secretKey = process.env.MINIO_SECRET_KEY || "";

export const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || "multitenanttest";

export const minioClient = new Minio.Client({
  endPoint: endpoint,
  port: port,
  useSSL: useSSL,
  accessKey: accessKey,
  secretKey: secretKey,
});


// Helper: Upload Buffer directly to MinIO
export async function uploadToMinio(buffer, filename, mimeType = "image/jpeg") {
  const safeFilename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

  // Ensure bucket exists
  try {
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME, "us-east-1");
    }
  } catch (err) {
    console.warn("MinIO bucket check warning:", err?.message);
  }

  // Upload file buffer
  await minioClient.putObject(BUCKET_NAME, safeFilename, buffer, buffer.length, {
    "Content-Type": mimeType,
  });

  // Construct direct public URL
  const protocol = useSSL ? "https" : "http";
  const portSuffix = (port === 80 || port === 443) ? "" : `:${port}`;
  const publicUrl = `${protocol}://${endpoint}${portSuffix}/${BUCKET_NAME}/${safeFilename}`;

  return publicUrl;
}

// Helper: Convert base64 data URL to Buffer and upload to MinIO
export async function uploadBase64ToMinio(dataUrl, preferredName = "upload") {
  if (!dataUrl || typeof dataUrl !== "string") return dataUrl;

  // If already an HTTP/HTTPS URL, return as is
  if (dataUrl.startsWith("http://") || dataUrl.startsWith("https://")) {
    return dataUrl;
  }

  // Match base64 data URL pattern: data:[<mediatype>];base64,<data>
  const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return dataUrl;
  }

  const mimeType = matches[1];
  const buffer = Buffer.from(matches[2], "base64");
  const ext = mimeType.split("/")[1] || "jpg";
  const filename = `${preferredName}-${Date.now()}.${ext}`;

  return await uploadToMinio(buffer, filename, mimeType);
}

export default minioClient;
