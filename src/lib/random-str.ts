const characters =
	"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

export function randomStr(length = 8) {
	return Array.from({ length })
		.map(() => characters[Math.floor(Math.random() * characters.length)])
		.join("");
}
