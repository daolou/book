#include <errno.h>
#include <limits.h>
#include <pwd.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#define MY_DYNAMIC_PATH_MAX (32768 * 3 + 32)

static char* agetcwd()
{
    size_t sz = 4096;
    char* buf = malloc(sz);
    while (getcwd(buf, sz) == NULL) {
        if (errno != ERANGE) {
            dprintf(STDERR_FILENO, "getcwd() failed: %s\n", strerror(errno));
            abort();
        }
        if (sz >= MY_DYNAMIC_PATH_MAX) {
            dprintf(STDERR_FILENO, "agetcwd: current directory path stupidly way too long\n");
            abort();
        }
        sz *= 2; if (sz > MY_DYNAMIC_PATH_MAX) sz = MY_DYNAMIC_PATH_MAX;
        buf = realloc(buf, sz);
    }

    if (strncmp(buf, "/mnt/", 5) != 0) {
        const char* rootdir = "/mnt/c/wsl/rootfs";
        char* newbuf = malloc(sz + strlen(rootdir));
        strcpy(newbuf, rootdir);
        strcat(newbuf, buf);
        free(buf);
        buf = newbuf;
    }

    return buf;
}

static char* convert_drive_fs_path_to_win32(const char* path)
{
    char* result = malloc(4 + strlen(path));
    result[0] = path[5];
    result[1] = ':';
    result[2] = '\\';
    strcpy(result + 3, path + 7);
    int i;
    for (i = 3; result[i]; i++)
        if (result[i] == '/')
            result[i] = '\\';
    return result;
}

char* ncmd[100] = {"z", "/mnt/c/Windows/System32/cmd.exe", "/C"};
int ncmd_index = 3;

int main(int argc, char* argv[])
{
    char* cwd = agetcwd();
    char* cwd_win32 = NULL;

    if (argc == 1) {
        cwd_win32 = convert_drive_fs_path_to_win32(cwd);
        printf("%s\n", cwd_win32);
        free(cwd_win32);
        free(cwd);
        return 0;
    }

    if (strstr(cwd, "/wsl/rootfs/") != NULL) {
        cwd_win32 = convert_drive_fs_path_to_win32(cwd);
        ncmd[ncmd_index++] = "cd";
        ncmd[ncmd_index++] = "/d";
        ncmd[ncmd_index++] = cwd_win32;
        ncmd[ncmd_index++] = "&";
    }

    if (argv[1][0] == '.' && argv[1][1] == '/') {
        ncmd[ncmd_index++] = argv[1] + 2;
    } else {
        ncmd[ncmd_index++] = argv[1];
    }

    for (int i = 2; i < argc; ++i) {
        ncmd[ncmd_index++] = argv[i];
    }

    ncmd[ncmd_index++] = NULL;

    if (getenv("Z_DEBUG") != NULL) {
        for (int i = 0; i < ncmd_index - 1; ++i) {
            printf("[%d] => %s\n", i, ncmd[i]);
        }
    }

    execv("/init", ncmd);

    free(cwd_win32);
    free(cwd);
    return 0;
}
