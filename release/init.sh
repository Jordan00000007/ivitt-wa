source ./.env

echo "output folder: ${OUTPUT_FOLDER}"
echo "output file name: ${OUTPUT_IMAGE_NAME}"
echo "image name: ${IMAGE_NAME}"

cd ..

rm -rf "${OUTPUT_FOLDER}"
mkdir "${OUTPUT_FOLDER}"

docker build -t ${IMAGE_NAME} .
docker save -o ${OUTPUT_FOLDER}/${OUTPUT_IMAGE_NAME} ${IMAGE_NAME}
